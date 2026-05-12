import { Logo } from './Header';
import { IconTikTok, IconInstagram, IconFacebook } from './Icons';

export default function Footer() {
  return (
    <footer className="site">
      <div className="footer-top">
        <div>
          <Logo />
          <p className="blurb">
            Працюємо в Києві та області. Беремо на себе всі етапи ремонту, щоб ви отримали результат без стресу, затримок і зайвих витрат
          </p>
          <div className="footer-nav">
            <a href="#cases">Проєкти</a>
            <a href="#reviews">Відгуки</a>
            <a href="#prices">Ціни</a>
            <a href="#faq">FaQ</a>
          </div>
        </div>
        <div className="footer-contact">
          <span className="lbl">Зв'язатися з нами</span>
          <a className="phone" href="tel:+380630282440">+380 63 028 2440</a>
          <span className="addr">{`вул. Антоновича, 66\nКиїв, Україна, 02000`}</span>
          <div className="socials">
            <a href="#" aria-label="TikTok"><IconTikTok className="ic" /></a>
            <a href="#" aria-label="Instagram"><IconInstagram className="ic" /></a>
            <a href="#" aria-label="Facebook"><IconFacebook className="ic" /></a>
          </div>
        </div>
      </div>
      <div className="footer-bot">
        <span>©KapiBud {new Date().getFullYear()}</span>
        <a href="#">Privacy &amp; Policy</a>
      </div>
    </footer>
  );
}
