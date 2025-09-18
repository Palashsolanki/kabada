import { eachOfLimit } from 'async'
import axios from 'axios'
import { load } from 'cheerio'
import fs, { writeFile } from 'fs/promises'
import { Parser } from 'json2csv'

const cookie = `community-alert-expanded=false; MMS_SEGMENT=HME; _ga=GA1.1.549840908.1751879365; _mkto_trk=id:837-LBN-556&token:_mch-mckesson.com-95040a59297024ea1a2d7af2f731da8d; _pendo_visitorId.1291695225=_PENDO_T_c0SRFFc9EIS; visid_incap_1802153=eEzcpQ4XTR2E/l+RWeQsKzz3cGgAAAAAQUIPAAAAAAACYVUXrbrQE8M07G0PfWIt; _gcl_au=1.1.1448732776.1751879364.1144836338.1755073823.1755073846; nlbi_2754305=JWzZZzjzajSgb526+tP4sQAAAAAJPvi9Ek7s/Qdk4cGePcrB; rxVisitor=1757137332986LPKRMQMEU37OHJ63G6GHNJPM7JOG09LF; _pendo_unsentEvents.13c233e2-295d-454b-406e-7fb811695c5a=; _pendo_visitorId.13c233e2-295d-454b-406e-7fb811695c5a=; _pendo_accountId.13c233e2-295d-454b-406e-7fb811695c5a=; _pendo_meta.13c233e2-295d-454b-406e-7fb811695c5a=; _pendo_sessionId.13c233e2-295d-454b-406e-7fb811695c5a=; _pendo_oldVisitorId.13c233e2-295d-454b-406e-7fb811695c5a=; nlbi_734530=NMP/B9/dqSK9+oIs3o+ICwAAAAB8xMq2Kaf9Q3hWLiyKzjd+; session-expiration-logged-in=true; community-alert-expanded=false; liveagent_sid=d4eab111-86b0-46c9-b9bb-dd29ec3f7b1a; nlbi_379597=Q/gJVEtuGhcDTGQejnyz5wAAAADPcs4O4kq1uT6hotX3Wij9; dtCookie=v_4_srv_4_sn_2DF3E0C021A52B99F6A17AA7ECEB4000_perc_100000_ol_0_mul_1_app-3A508ede8ee0d1bd82_1; nlbi_2420321=LiqtdGy7I30mvuARUIWeDQAAAADiUYR43KLmQFkkIWA68gIe; incap_ses_49_2754305=3yDYJFY470sA1tTQoRWuAF/Nx2gAAAAAKLT15Yoj8lILD22jJqfTRw==; incap_ses_707_2258952=x+RKLaPKRSgf0p6vEsXPCWHNx2gAAAAANWPTWXwDmQfBunJvCgT6Fg==; incap_ses_49_734530=4tgGO34UNwrqWtXQoRWuAJnNx2gAAAAAAuBJkWEqfYvff19GtpBUIg==; incap_ses_50_379597=X9ckY02JM3hX+RNqJ6OxAJvNx2gAAAAAkPgFNNl/enyomf8KkhkElw==; liveagent_vc=1; incap_ses_939_2420321=j45eVVup5QTMz0VdlP8HDWpjymgAAAAApPpYRFBJS1ewGhWN30jz2A==; liveagent_oref=https://portal.mms.mckesson.com/; visid_incap_2258952=FTmDETJCRbyf5bIaPf1raGGZymgAAAAAQUIPAAAAAAC30ItxRK54uuWmceoFjcCb; incap_ses_988_2258952=LxPFdhbbkA+qH8/n0RS2DWGZymgAAAAA2qleKvXh0whlRXDAm6R+XA==; incap_ses_939_734530=MOGPSYNLxScjBA1elP8HDXuZymgAAAAAV3Bb6WHSWilUUUAeQZXtww==; incap_ses_940_379597=2v6DS3ELu342vDoDE40LDbKZymgAAAAA4kT99gJJ6Ri0S6Zl6gKWmQ==; incap_ses_939_2754305=nh5qLnaPTEHLsUtelP8HDTCqymgAAAAAcHbHDjz5mK05uE7g7O3fmw==; visid_incap_2754305=19HdJzW7QaaIfTVHmSxw+lmby2gAAAAAQUIPAAAAAACiAtHiFN3SvTlA6n8Ew7Rf; incap_ses_937_2754305=122yGlDT5zNQFMMWl+QADVqby2gAAAAAIapA+8nFigo0wZ/t+gTdlA==; _pendo_meta.1291695225=1063668879; _pendo_utm.1291695225=%7B%22channel%22%3A%22Direct%22%7D; _pendo_guides_blocked.13c233e2-295d-454b-406e-7fb811695c5a=0; nlbi_2754305_2147483392=4VmSS5ZaeW/hINMY+tP4sQAAAADhzlJGplaMsAeNcmt2fTj4; _br_uid_2=uid%3D3229826637124%3Av%3D15.0%3Ats%3D1751879368086%3Ahc%3D145; _pendo_utm.13c233e2-295d-454b-406e-7fb811695c5a=%7B%22referrer%22%3A%22portal.mms.mckesson.com%22%7D; _pendo_sessionId.1291695225=%7B%22sessionId%22%3A%22pi6x4xxh0BItqHBq%22%2C%22timestamp%22%3A1758174093944%7D; bWNrZXNzb24uY29t-_lr_tabs_-autd9h%2Fprod-supplymanager={%22recordingID%22:%226-01995b56-e48c-7e5e-980e-11b8811c4eaf%22%2C%22sessionID%22:0%2C%22lastActivity%22:1758174093970%2C%22hasActivity%22:true%2C%22confirmed%22:true%2C%22clearsIdentifiedUser%22:false}; bWNrZXNzb24uY29t-_lr_hb_-autd9h%2Fprod-supplymanager={%22heartbeat%22:1758174093970}; SIMONESESSIONID=NGYzNGY4MWUtNGIwYi00OTczLWE5ZTUtMDNlMDcxMjIyMDZh; visid_incap_734530=ggTlYJguSTibgQXj1ZqXDY2by2gAAAAAQUIPAAAAAADWJU/x4R3ZbXTP6dzDEjrI; incap_ses_937_734530=rWY9MqRJHlEmaMMWl+QADY6by2gAAAAAZQij5s06/a5YqqM/kpbQlQ==; _ga_5DWL0JSNDR=GS2.1.s1758174045$o65$g1$t1758174095$j10$l0$h0; _ga_4XF20JDM68=GS2.1.s1758174045$o83$g1$t1758174095$j10$l0$h0; reese84=3:QPHyIPjJxKwvmL59JMDBGA==:jYqlW//3jaDMz2ZWFCrwzFYBatcvgFKXqFuBtNWsh0rDuN+B9roG/wc1U9NQv653xEv0D0T3tW+5SnJNczmRGZojIs+9hIyK5woliFRqHmBAKCSn+YLwBrzNOejqMPN4oGVQCYvsrHgrFD/jwnt9y+BHxTuDj4tbpLArwHsCayx3Pmpz8N0UmkKu3CDS1AdYYCP2wQjNLgjp9fhVSLY18UMF4dpj+QMCzfLGglEww8NabjPjaNFDobWXXUlhNPHaakrB05WvFWCDl/I/vcAPdJeNLj+L49ijWsz1QC6gS2jEy+M4hsndc7aYIHLPkVz9666cAzh8/FEOOfFlQpikduRGYRmUPUSoJGcceeOqHtT73riOH19gy5q9YSqU/ke2ZdhQrnMlADihZ66jDVJTXQyypPt9r6u+SwrT0ZrDqkVsWiKePQjLdMJ4CMnJK8YG7Sw8+JKfZ6Sw4pxMvuRdah/60OcYacQC2t24cxLRD26wttAc3cv3wHhwESxgyhLB:MUCVR959RichGjvqI78H7W5uChGP9bwV/JGCqFK7zkA=; visid_incap_379597=WfxBbh8/SO2UxKgSzBnVuumby2gAAAAAQUIPAAAAAAD43xZ0GdZ0qMblVIBEbfLz; incap_ses_939_379597=EiDlcsipXmCEjlhglP8HDemby2gAAAAAdIRs3Kzpq+PTGVTYsYRFpQ==; visid_incap_2420321=50Gp+gA3QeOY/j4o0mOoz+mby2gAAAAAQUIPAAAAAAAmSxwhWLkuVCuvfSLeMxtV; incap_ses_937_2420321=y1H0Mu5I+0YR/8MWl+QADemby2gAAAAAtUgmKwrwhRkhHTnNZrNQ1A==; dtSa=-; session-expiration-client-time-offset=2106; nlbi_734530_2147483392=Ckt9d1wyZ3NZowTS3o+ICwAAAABHDjDGVK0uwBCfs+y+Fvjl; session-expiration-server-time=1758174280659; session-expiration-timeout-time=1758176080659; rxvt=1758176082133|1758174043082; dtPC=4$174279160_472h-vUASGQMECJHRMPKKRKWGCFMFVACVECUHS-0e0`

const client = axios.create({
  baseURL: 'https://mms.mckesson.com',
  headers: {
    cookie
  }
})

const main = async () => {
  const allCategories = []

  const productIdSet = new Set()

  const products = []
  const finalProducts = []
  const match = [
    'EA',
    'CS',
    'PK',
    'BX',
    'PR',
    'ST',
    'CT',
    'KT',
    'RL',
    'BG',
    'DZ'
  ]

  try {
    const { data: catalogPage } = await client.get('/catalog/category?node=255')

    const $ = load(catalogPage)

    $('a', '.refine').each((_, a) => {
      allCategories.push({
        name: $(a).text().trim(),
        url: $(a).attr('href') || '',
        visited: false
      })
    })

    console.log('allCategories', allCategories)

    console.log('first level categories length:', allCategories.length)

    const getCategoriesRecursive = async categories => {
      await eachOfLimit(categories, 10, async category => {
        const { data: categoryPageData } = await client.get(category.url)
        const $ = load(categoryPageData)
        category.visited = true
        if (categoryPageData.includes('narrow-results-top')) {
          const subCategories = []
          $('li > a', '#collapse0').each((_, a) => {
            subCategories.push({
              name: $(a).text().trim(),
              url: $(a).attr('href') || '',
              visited: false
            })
          })
          allCategories.push(...subCategories)
          await getCategoriesRecursive(subCategories)
        } else {
          await getProducts($, productIdSet, products, category.url)
        }
      })
    }

    await getCategoriesRecursive(allCategories)

    console.log('after recursive categories get:', allCategories.length)
    console.log('products length:', products.length)

    productIdSet.clear()
    const variantAddedIdSet = new Set()

    await eachOfLimit(products, 10, async (productInfo, idx) => {
      const pct = ((Number(idx) + 1) / products.length) * 100
      if (Number(idx) % 1000 === 0) {
        console.log(`${Number(idx) + 1} out of ${products.length} : ${pct}%`)
      }

      if (productIdSet.has(productInfo.id)) return
      productIdSet.add(productInfo.id)

      const { data: productPageData } = await client.get(productInfo.url)
      const $ = load(productPageData)

      const title = $('.prod-title').text().trim()
      const shortTitle = $('.prod-invoice-title').text().trim()
      const brandName = $(
        'div:nth-child(2) > div > div.item-header > ul > li:nth-child(3)'
      )
        .text()
        .trim()
      const uomsWithPrices = []

      $('div.product-select-unit-of-measure select > option').each(
        (_, uomOption) => {
          uomsWithPrices.push({
            uom: $(uomOption).attr('data-uom'),
            uomToEach: $(uomOption).attr('data-eaches'),
            price: $(uomOption).attr('data-price')
          })
        }
      )

      const specifications = {}
      $('#specifications table tr').each((_, spec) => {
        const key = $('th', spec).text().trim()
        const value = $('td', spec).text().trim()
        specifications[key] = value
      })

      const stockMessage = $('.product-availability')
        .text()
        .trim()
        .split('\n')
        .map(ss => ss.trim())
        .filter(ss => ss !== '')

      uomsWithPrices.forEach(uomEntry => {
        const { uom, uomToEach, price } = uomEntry
        if (!uom || !price) return

        const cleanUom = uom.trim()
        const cleanUomToEach = parseInt(uomToEach || 'NaN')
        const cleanPrice = parseFloat(price.replace(/[^0-9.]/g, ''))

        if (match.includes(cleanUom) && !isNaN(cleanPrice)) {
          finalProducts.push({
            url: productInfo.url,
            id: parseInt(productInfo.id),
            mfr: productInfo['Manufacturer #'] || '',
            name: title,
            shortTitle: shortTitle || '',
            brandName: brandName.replace(/\s*#.*$/, '') || '',
            stockStatus: stockMessage[0] || '',
            stockMessage: stockMessage[stockMessage.length - 1] || '',
            uom: cleanUom || 'NaN',
            uomToEach: cleanUomToEach,
            price: cleanPrice
          })
        }
      })
    })

    await writeFile('test.json', JSON.stringify(finalProducts))

    const parser = new Parser()

    const csvData = parser.parse(data)

    await fs.writeFile('test.csv', csvData)
  } catch (error) {
    console.error(error)
    await writeFile('test-Catch.json', JSON.stringify(finalProducts))
  }
}

const getProducts = async ($, productIdSet, products, pageUrl) => {
  const totalPages = parseInt($('#catalog').attr('data-total-pages') || '1')
  await eachOfLimit(
    Array.from({ length: totalPages }, (_, i) => i + 1),
    5,
    async page => {
      if (page !== 1) {
        const { data: nextPageProductsData } = await client.get(
          `${pageUrl}&pageOffset=${page - 1}`
        )

        $ = load(nextPageProductsData)
      }
      $('.product-item').each((_, el) => {
        const productId = $(el).attr('data-item-id')
        if (!productId || productIdSet.has(productId)) return
        productIdSet.add(productId)
        products.push({
          id: productId,
          url: $('.item-title > a', el).attr('href')?.trim() || ''
        })
      })
    }
  )
}

main()
