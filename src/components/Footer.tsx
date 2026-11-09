import Logo from './Logo'
import Icon from './Icon'
import { site } from '../config'
import type { Dict } from '../i18n'

export default function Footer({ t }: { t: Dict }) {
  const wa = site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}` : ''
  const mail = site.supportEmail ? `mailto:${site.supportEmail}` : ''

  return (
    <footer id="contact" className="footer">
      <div className="container footer-grid">
        <div>
          <Logo light />
          <p className="footer-about">{t.footer.about}</p>
        </div>
        <div>
          <h4>{t.footer.shop}</h4>
          <a href="#categories">{t.nav.categories}</a>
          <a href="#featured">{t.featuredTitle}</a>
        </div>
        <div>
          <h4>{t.footer.policies}</h4>
          <a href="#contact">{t.footer.shipping}</a>
          <a href="#contact">{t.footer.returns}</a>
          <a href="#contact">{t.footer.privacy}</a>
          <a href="#contact">{t.footer.terms}</a>
          <a href="#contact">{t.footer.faq}</a>
        </div>
        <div>
          <h4>{t.footer.contact}</h4>
          {wa && <a href={wa} target="_blank" rel="noreferrer"><Icon name="chat" size={16} /> {t.footer.whatsapp}</a>}
          {mail && <a href={mail}><Icon name="mail" size={16} /> {t.footer.email}</a>}
          {!wa && !mail && <p className="footer-about">{t.footer.contactSoon}</p>}
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} MARTO. {t.footer.rights}
      </div>
    </footer>
  )
}
