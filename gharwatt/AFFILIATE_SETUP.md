# GharWatt product spotlight / EarnKaro links

The site now displays three **editorial product category cards**. No affiliate links or tracking are active while the Profit Links remain blank.

## Add an EarnKaro Profit Link

1. Sign in at https://earnkaro.com/ and create a Profit Link for a particular relevant product. Confirm that both EarnKaro and the retailer allow it to be promoted on a public website.
2. Open `gharwatt/assets/affiliate-links.json` in this GitHub repository, then select **Edit**.
3. Under the matching product category, fill the **actual product name** and its **full HTTPS EarnKaro Profit Link**. Example:

```json
"energy-meter": {
  "product_name": "Actual product name from the merchant",
  "profit_link": "https://YOUR-VALID-EARNKARO-PROFIT-LINK"
}
```

4. Save/commit. The GitHub Pages workflow republishes the website. Check the link and product details on a phone.
5. Only configured valid links generate a **View product** action. Cards automatically label the link as an affiliate promotion and apply `rel="sponsored nofollow noopener noreferrer"`.

Never paste your EarnKaro login password, secret, bank details or personal information here. Only paste a public Profit Link. Do not add fake reviews, prices, discount claims or product images without permission.

**Relevant page locations:** the homepage after the hero, the Home Energy Products guide and the solar maintenance article. When no Profit Link is configured, cards continue to link to independent buying advice.

No popups, autoplay, fake AdSense ads, click tracking, personal data collection or guarantees of affiliate earnings are used.
