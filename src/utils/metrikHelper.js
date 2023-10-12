import { GTM_ID } from '@/utils/constants'

export const metrikHead = () => {
  return (
    <>
      <script
        defer
        dangerouslySetInnerHTML={{
          __html: ` var _smartsupp = _smartsupp || {};
          _smartsupp.key = 'adbb9023c19dfe8868a9575a22ee481f18d9d20a';
          window.smartsupp||(function(d) {
          var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
          s=d.getElementsByTagName('script')[0];c=d.createElement('script');
          c.type='text/javascript';c.charset='utf-8';c.async=true;
          c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
        })(document);`,
        }}
      />
    </>
  )
}

export const metrikGoogleGTMHead = () => {
  return (
    <>
      <script
        defer
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    </>
  )
}

export const metrikGoogleGTMBody = () => {
  return (
    <>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=G-5K7YG6B04B"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      />
    </>
  )
}
