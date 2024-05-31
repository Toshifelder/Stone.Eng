import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import type { Gallery } from '../types/Gallery'
import React, { useState, useEffect, useRef } from 'react'
import { GetServerSideProps } from 'next';
import { client } from "../libs/client"
import { ParallaxProvider, ParallaxBanner } from 'react-scroll-parallax'
import { Link as Scroll } from "react-scroll"

type Props = {
  gallery: Gallery;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await client.get({endpoint: "gallery"});

  return {
    props: {
      gallery: data.contents,
    },
  };
};

const Home: NextPage<Props> = ({ gallery }) => {
  const [scrollStyle, setScrollStyle] = useState<React.CSSProperties>();
  const scrollTop = (): number => {
    return Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
  };
  const onScroll = () => {
    const bgPosition = scrollTop()/2;
    const style: React.CSSProperties = {
      backgroundPosition: 'center -' + bgPosition + 'px'
    }
    setScrollStyle(style);
  }
  useEffect(() => {
    document.addEventListener('scroll', onScroll);
    return (): void => document.removeEventListener("scroll", onScroll);
  })

  const [form, setForm] = useState({
    name: '',
    email: '',
    msg: '',
  });
  const handleSubmit = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    fetch('/api/mail', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        msg: form.msg,
      }),
    })
    .then((res) => {
      console.log('Response received');
      if (res.status === 200) {
        console.log('Response succeeded!');
        alert(
          `お問い合わせを受け付けました。
ご入力いただいたメールアドレスに自動返信メールをお送りしております。
届いていない場合は、正常に送信できていない可能性がございますので、恐れ入りますがご入力を確認のうえ、再度ご送信下さい。`
        );
      } else {
        console.log(`Error: Status Code ${res.status}`);
      }
    })
    .catch((e) => {
      console.log(`Error: ${e}`);
    });
  };

  return (
    <>
      <Head>
        <title>Stone.Eng</title>
        <meta name="description" content="Stone.Eng" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div id="top" className={styles.hero}>
          <Image src="/IMG_2035.JPG" alt="IMG_2035.JPG" width={3000} height={1260} />
        </div>

        <div className={styles.title}>
          <div className={styles.titleLogo}>
            <Image src="/ロゴoriginal.png" alt="titleLogo" width={3000} height={3000} />
          </div>
          <div className={styles.titleText}>
            Stone.Eng<br/>
            &quot;Everyday is handmade&quot;<br/>
            Something little by little<br/>
          </div>
        </div>

        <div id="gallery" className={styles.gallery}>
          <h1 className={styles.galleryTitle}>GALLERY</h1>
          <div className={styles.galleryImages}>
            <ul className={styles.grid}>
              {Array.isArray(gallery) && gallery.map((gallery) => (
                <Link href={`${gallery.link}`} key={gallery.id}>
                  <li key={gallery.id}>
                    <div className={styles.imageText}>{`${gallery.title}`}</div>
                    <a><Image src={gallery.image.url} width={300} height={300} alt={gallery.title} /></a>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>

        <div id="about" className={styles.about} style={scrollStyle}>
          <div className={styles.aboutText}>
            <h2 className={styles.aboutTitle}>ABOUT</h2>
            <div className={styles.aboutStatement}>
              ものづくりの原点は、およそ石器時代の職工たちにあると思われます。<br /><br />
              彼等は欲しい物がある場合、自ら考え、自らの手で創り上げることを当たり前としていました。<br /><br /><br />
              わたしたちはこういった&ldquo; 原始のものづくりの精神 &ldquo;を礎に制作に取り組んでおります。<br /><br />
              こだわりやわがままを余す事なく注ぎ込むため、徹頭徹尾わたしたちの手で創っております。<br /><br /><br />
              当ブランドのEngineerたちは、建築やデザイン,ITなど様々な分野から、誠実にものづくりと向き合い、より良いプロダクトを紡ぎ上げるに結集しました。<br /><br /><br />
              &lt; Stone.Engineer &gt;<br />
              太古の職人たちへのリスペクトと、ものづくりに慈しみを込めて、ブラントネームに&lsquo;Stone&lsquo;の名を冠しております。<br /><br />
            </div>
          </div>
          <Link href="https://stoneengneer.official.ec/">
            <div className={styles.aboutShop}>
              <div className={styles.shopText}>Online Shop</div>
                <a><Image src="/evo.jpg" alt="shopImage" width={1280} height={1280} /></a>
            </div>
          </Link>
        </div>

        <div id="contact" className={styles.contact}>
          <h3 className={styles.contactTitle}>CONTACT US</h3>
          <div className={styles.contactForm}>
            <form>
              <input
                onChange={(e) => {
                  const val = e.currentTarget.value;
                  setForm((props) => ({
                    ...props,
                    name: val !== null ? val : '',
                  }));
                }}
                value={form.name}
                name="name"
                type="text"
                className={styles.feedbackInput}
                placeholder="Name"
              />
              <input
                onChange={(e) => {
                  const val = e.currentTarget.value;
                  setForm((props) => ({
                    ...props,
                    email: val !== null ? val : '',
                  }));
                }}
                name="email"
                type="text"
                className={styles.feedbackInput}
                placeholder="Email"
              />
              <textarea
                onChange={(e) => {
                  const val = e.currentTarget.value;
                  setForm((props) => ({
                    ...props,
                    msg: val !== null ? val : '',
                  }));
                }}
                name="text"
                className={styles.feedbackInputComent}
                placeholder="Comment"
              ></textarea>
              <input
                onClick={async (e) => {
                  await handleSubmit(e);
                }}
                className={styles.submit}
                type="submit"
                value="送信する"
              />
            </form>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <nav className={styles.menu}>
          <Scroll to="top" smooth={true} duration={600}>TOP</Scroll>
          <Scroll to="gallery" smooth={true} duration={600}>GALLERY</Scroll>
          <Scroll to="about" smooth={true} duration={600}>ABOUT</Scroll>
          <Scroll to="contact" smooth={true} duration={600}>CONTACT</Scroll>
        </nav>
        <div className={styles.sns}>
          <Link href="https://www.instagram.com/stone.eng_/">
            <a className={styles.logo}>
              <Image src="/glyph-logo_May2016.png" alt="Instagram Logo" width={20}height={20} />
            </a>
          </Link>
        </div>
        <div className={styles.signature}>© 2022 Stone.Eng</div>
      </footer>
    </>
  )
}

export default Home

