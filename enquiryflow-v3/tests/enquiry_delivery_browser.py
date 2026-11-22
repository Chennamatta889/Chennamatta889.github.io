"""EnquiryFlow v3.7: actual browser regression of demo intake and staff visibility.
No external browser automation. No real student information or network calls.
"""
from playwright.sync_api import sync_playwright
from browser_harness import build_html

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    errors=[]
    student=browser.new_page(viewport={'width':375,'height':812})
    student.on('pageerror',lambda error:errors.append('student: '+str(error)))
    student.evaluate('''() => {
      const saved={};
      Object.defineProperty(window,'localStorage',{configurable:true,value:{
        getItem:key=>saved[key]??null,
        setItem:(key,value)=>{saved[key]=String(value)},
        removeItem:key=>{delete saved[key]}
      }});
    }''')
    student.set_content(build_html('student'),wait_until='domcontentloaded')
    form=student.locator('#enquiryForm')
    form.wait_for(timeout=10000)
    assert 'Save fictional enquiry locally' in form.inner_text()
    form.locator('[name=full_name]').fill('Demo Enquiry Learner')
    form.locator('[name=email]').fill('demo.enquiry@example.com')
    form.locator('[name=question]').fill('Please explain the fictional class demo process')
    form.locator('[name=consent]').check()
    form.locator('button[type=submit]').click()
    student.locator('#formResponse[data-delivery="local-only"]').wait_for(timeout=10000)
    response=student.locator('#formResponse')
    assert 'Saved locally — NOT sent to the institute' in response.inner_text(),response.inner_text()
    assert 'Nothing was emailed or delivered' in response.inner_text()
    assert response.locator('a').get_attribute('href')=='./staff/?view=enquiries'
    assert response.locator('a').is_visible()
    assert student.url=='about:blank'
    assert form.locator('button[type=submit]').is_enabled()
    store=student.evaluate('localStorage.getItem("enquiryflow_v3_demo_state")')
    assert store is not None
    import json
    leads=json.loads(store)['enquiries']
    assert len(leads)==3,len(leads)
    assert leads[0]['email']=='demo.enquiry@example.com'
    assert leads[0]['status']=='new'
    assert leads[0]['id'].startswith('DEMO-')

    staff=browser.new_page(viewport={'width':1280,'height':900})
    staff.on('pageerror',lambda error:errors.append('staff: '+str(error)))
    staff.evaluate('''snapshot => {
      const saved={'enquiryflow_v3_demo_state':snapshot};
      Object.defineProperty(window,'localStorage',{configurable:true,value:{
        getItem:key=>saved[key]??null,
        setItem:(key,value)=>{saved[key]=String(value)},
        removeItem:key=>{delete saved[key]}
      }});
    }''',store)
    staff.set_content(build_html('staff'),wait_until='domcontentloaded')
    staff.locator('[data-tab=enquiries]').wait_for(timeout=10000)
    staff.locator('[data-tab=enquiries]').click()
    staff.locator('#pageBody').get_by_text('Demo Enquiry Learner').wait_for(timeout=10000)
    assert '3 of 3 enquiries' in staff.locator('#enquiryMatchCount').inner_text()
    assert 'Demo Enquiry Learner' in staff.locator('#pageBody').inner_text()

    # The public intake must reject real personal information during demo mode.
    form.locator('[name=full_name]').fill('Real Person')
    form.locator('[name=email]').fill('person@gmail.com')
    form.locator('[name=question]').fill('Course timing?')
    form.locator('[name=consent]').check()
    form.locator('button[type=submit]').click()
    student.locator('.response.enquiry-error').wait_for(timeout=10000)
    assert 'not saved or sent' in response.inner_text().lower()
    assert len(json.loads(student.evaluate('localStorage.getItem("enquiryflow_v3_demo_state")'))['enquiries'])==3
    assert errors==[],errors
    browser.close()
print('PASS: student demo saves locally, explicit non-delivery status, same-browser staff demo sees enquiry, real email rejected, no JS errors')