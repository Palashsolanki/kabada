import { eachOfLimit } from 'async'
import axios from 'axios'
import { load } from 'cheerio'
import { writeFile } from 'fs/promises'

const cookie = `community-alert-expanded=false; MMS_SEGMENT=HME; _ga=GA1.1.549840908.1751879365; _mkto_trk=id:837-LBN-556&token:_mch-mckesson.com-95040a59297024ea1a2d7af2f731da8d; _pendo_visitorId.1291695225=_PENDO_T_c0SRFFc9EIS; visid_incap_1802153=eEzcpQ4XTR2E/l+RWeQsKzz3cGgAAAAAQUIPAAAAAAACYVUXrbrQE8M07G0PfWIt; _gcl_au=1.1.1448732776.1751879364.1144836338.1755073823.1755073846; nlbi_2754305=JWzZZzjzajSgb526+tP4sQAAAAAJPvi9Ek7s/Qdk4cGePcrB; rxVisitor=1757137332986LPKRMQMEU37OHJ63G6GHNJPM7JOG09LF; _pendo_unsentEvents.13c233e2-295d-454b-406e-7fb811695c5a=; _pendo_visitorId.13c233e2-295d-454b-406e-7fb811695c5a=; _pendo_accountId.13c233e2-295d-454b-406e-7fb811695c5a=; _pendo_meta.13c233e2-295d-454b-406e-7fb811695c5a=; _pendo_sessionId.13c233e2-295d-454b-406e-7fb811695c5a=; _pendo_oldVisitorId.13c233e2-295d-454b-406e-7fb811695c5a=; nlbi_734530=NMP/B9/dqSK9+oIs3o+ICwAAAAB8xMq2Kaf9Q3hWLiyKzjd+; session-expiration-logged-in=true; community-alert-expanded=false; liveagent_sid=d4eab111-86b0-46c9-b9bb-dd29ec3f7b1a; nlbi_379597=Q/gJVEtuGhcDTGQejnyz5wAAAADPcs4O4kq1uT6hotX3Wij9; dtCookie=v_4_srv_4_sn_2DF3E0C021A52B99F6A17AA7ECEB4000_perc_100000_ol_0_mul_1_app-3A508ede8ee0d1bd82_1; nlbi_2420321=LiqtdGy7I30mvuARUIWeDQAAAADiUYR43KLmQFkkIWA68gIe; incap_ses_49_2754305=3yDYJFY470sA1tTQoRWuAF/Nx2gAAAAAKLT15Yoj8lILD22jJqfTRw==; incap_ses_707_2258952=x+RKLaPKRSgf0p6vEsXPCWHNx2gAAAAANWPTWXwDmQfBunJvCgT6Fg==; incap_ses_49_734530=4tgGO34UNwrqWtXQoRWuAJnNx2gAAAAAAuBJkWEqfYvff19GtpBUIg==; incap_ses_50_379597=X9ckY02JM3hX+RNqJ6OxAJvNx2gAAAAAkPgFNNl/enyomf8KkhkElw==; liveagent_vc=1; _pendo_meta.1291695225=326557384; visid_incap_2420321=dbkzpxwYSIGOItiy1SoOBmpjymgAAAAAQUIPAAAAAACrS8ehtbOsGga8ayq3Fz5g; incap_ses_939_2420321=j45eVVup5QTMz0VdlP8HDWpjymgAAAAApPpYRFBJS1ewGhWN30jz2A==; _pendo_utm.1291695225=%7B%22channel%22%3A%22Referral%22%2C%22referrer%22%3A%22mms.mckesson.com%22%7D; _pendo_utm.13c233e2-295d-454b-406e-7fb811695c5a=%7B%22channel%22%3A%22Referral%22%2C%22referrer%22%3A%22mms.mckesson.com%22%7D; visid_incap_2754305=rOEYsRcxTgGKF6p7zhwltCKLymgAAAAAQUIPAAAAAAATP6a6140/KtMErLve2zGj; incap_ses_939_2754305=Upf9Ck318kc/R9BdlP8HDSKLymgAAAAA1XMrCZHCzdDfMQVsOCfRkg==; _pendo_guides_blocked.13c233e2-295d-454b-406e-7fb811695c5a=0; liveagent_oref=https://portal.mms.mckesson.com/; visid_incap_2258952=FTmDETJCRbyf5bIaPf1raGGZymgAAAAAQUIPAAAAAAC30ItxRK54uuWmceoFjcCb; incap_ses_988_2258952=LxPFdhbbkA+qH8/n0RS2DWGZymgAAAAA2qleKvXh0whlRXDAm6R+XA==; nlbi_2754305_2147483392=g2wtYHFPMx0VRMJ4+tP4sQAAAADPqpgFoXu1qKweyhlJl+LG; _ga_5DWL0JSNDR=GS2.1.s1758102723$o63$g1$t1758108026$j38$l0$h0; _ga_4XF20JDM68=GS2.1.s1758102723$o81$g1$t1758108026$j38$l0$h0; _pendo_sessionId.1291695225=%7B%22sessionId%22%3A%22JVy35a2s914ttl2Q%22%2C%22timestamp%22%3A1758108026532%7D; bWNrZXNzb24uY29t-_lr_tabs_-autd9h%2Fprod-supplymanager={%22recordingID%22:%226-0199574c-030e-7428-8a4c-97b1f64a814c%22%2C%22sessionID%22:0%2C%22lastActivity%22:1758108026593%2C%22hasActivity%22:true%2C%22confirmed%22:true%2C%22clearsIdentifiedUser%22:false}; bWNrZXNzb24uY29t-_lr_hb_-autd9h%2Fprod-supplymanager={%22heartbeat%22:1758108026594}; _br_uid_2=uid%3D3229826637124%3Av%3D15.0%3Ats%3D1751879368086%3Ahc%3D142; SIMONESESSIONID=ZTc2MTU5N2UtOTlkNS00MDY3LTlmN2ItNjNlZWU0NTkyYzNk; visid_incap_734530=dOQZkhU8R9qj2TmSgnPFWnqZymgAAAAAQUIPAAAAAADR3d55amB45sqbbJ24HGuy; incap_ses_939_734530=MOGPSYNLxScjBA1elP8HDXuZymgAAAAAV3Bb6WHSWilUUUAeQZXtww==; reese84=3:430kum6VbJhlXjUTCLjyUg==:A9TRmllatJsRpGlw1ouTUAoa20FiRmGVrDiEe7wznO80hHSx4cAVcZ2s0Qq5q7cMasmVr0ekl/osiXhgRNjs/Q2EGCVjVMM0s8xNJxOyKprVK2M/XtDoOEY99i2WmLqJDZ4sW8tcg1vwM4B6gt3o81esrV0LxK8GxDLuHgMMVFxWkVdFVVv7DrBcKaiOjszBsAZS3D6uNR4sAYw+B19HPVAXXYFHM4v0IXKrryv/hOHDArt1Irgd+kyYdtoTL+bWLygmomnGBz5ZqpTSbUA+qXxOtcmqdQbqqeaRxN9a4+Y7qwq5OURfNv722k1l3ZuO4K4vZ5OE0b7a+ki2WjBks93XWKfoxYA5kfDW07IIAZZ+8D04BLctqXdlCRqVTWf7obtzac11c7AIH+827On5rU5FfVN0wHQjhTP4NmF/BfWi5S1tCBdIdAP0TyxjBwcDiMuNzHtEjtjgpylHYS9xrCibdLYhhKHLbbso62Ye+zQp34yc/fE4cbbyll1nkHPb:Ag/9Pd1+kab4DMvSuJj4dKcIdAg1dRTrqaaJyGJfZ/0=; visid_incap_379597=JoVmtft1T8yrzIO6kfy5rbKZymgAAAAAQUIPAAAAAAAWpIiXNWjNz/FcC5PBgU+L; incap_ses_940_379597=2v6DS3ELu342vDoDE40LDbKZymgAAAAA4kT99gJJ6Ri0S6Zl6gKWmQ==; dtSa=-; session-expiration-client-time-offset=1108; nlbi_734530_2147483392=xDHiQZu34hyOGDeR3o+ICwAAAADl5XMIOyuNtklt5VVen8tm; rxvt=1758110188981|1758102440075; session-expiration-server-time=1758108388132; session-expiration-timeout-time=1758110188132; dtPC=4$108386265_200h-vMQWMMCVVACMQNJCACHJPTRUPFQTSCPUM-0e0`

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
    const { data: catalogPage } = await client.get('/catalog?node=5232897')

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

      // const variants = []

      // const images = []
      // $('.image-gallery-modal.gallery.text-center img').each((_, img) => {
      //   const imgSrc = $(img).attr('src')
      //   if (!imgSrc) return
      //   images.push(imgSrc)
      // })

      $('div.product-select-unit-of-measure select > option').each(
        (_, uomOption) => {
          uomsWithPrices.push({
            uom: $(uomOption).attr('data-uom'),
            uomToEach: $(uomOption).attr('data-eaches'),
            price: $(uomOption).attr('data-price')
          })
        }
      )

      // $('.prod-summary a.tag').each((_, variant) => {
      //   const variantUrl = $(variant).attr('href')
      //   if (!variantUrl) return
      //   const productId = variantUrl.split('/').pop()
      //   if (!productId) return

      //   if (variantAddedIdSet.has(productId)) return
      //   variantAddedIdSet.add(productId)

      //   variants.push({
      //     id: productId,
      //     value: $(variant).text().trim()
      //   })
      // })

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

      // const finalProductData = {
      //   ...productInfo,
      //   title,
      //   uomsWithPrices,
      //   variants,
      //   ...specifications
      // images: Array.from(new Set(images)),
      // features: $('#specifications .product-features').html()?.trim()
      // }
      // finalProducts.push(finalProductData)
    })

    await writeFile('test.json', JSON.stringify(finalProducts))
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

const test = async () => {
  await writeFile('product.html', (await client.get('/product/1020958')).data)
}
main()
test
