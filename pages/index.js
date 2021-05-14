import Head from 'next/head';
import Instagram from 'instagram-web-api';
import Banner from 'components/home/banner';
import Services from 'components/home/services';
import GalleryGrid from 'components/gallery';
import SocialMedia from 'components/home/social-media';
import TitleAndButton from 'components/home/title-and-button';
import styles from 'styles/Home.module.css';
import { getGalleryPhotos } from 'utils/fauna';
import imageSourceFormatter from 'utils/image-source-format';

export default function Home({ gallery, instagram }) {
  return (
    <>
      <Head>
        <title>
          Wave Landscaping & Design: lawn maintenance and design services
        </title>
        <meta
          name="description"
          content="Wave Landscaping & Design is the premiere landscaping design and maintenance service in West Palm Beach, FL."
        />
        <meta
          property="og:title"
          content="Wave Landscaping & Design: lawn maintenance and design services"
        />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:url"
          content="https://wavelandscapinganddesign.com"
        />
        <meta
          property="og:image"
          content="https://ia.media-imdb.com/images/rock.jpg"
        />
        <meta
          property="og:description"
          content="Wave Landscaping & Design is the premiere landscaping design and maintenance service in West Palm Beach, FL."
        />
      </Head>
      <Banner />
      <div className={styles.grayBackground}>
        <Services />
        <h3 className="text-center mb-4" style={{ fontSize: '2.4rem' }}>
          <strong>Gallery</strong>
        </h3>
        <GalleryGrid photos={gallery} />
        <TitleAndButton
          title="This is only a glimpse of what we can do"
          link="/gallery"
          label="Full Gallery"
        />
        <br />
      </div>
      <SocialMedia feed={instagram} />
    </>
  );
}

export async function getStaticProps() {
  const galleryData = await getGalleryPhotos();
  const client = new Instagram({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD,
  });

  let posts = [];
  try {
    await client.login();
    // request photos for a specific instagram user
    const instagram = await client.getPhotosByUsername({
      username: process.env.INSTA_USERNAME,
    });

    if (instagram.user.edge_owner_to_timeline_media.count > 0) {
      // if we receive timeline data back
      //  update the posts to be equal
      // to the edges that were returned from the instagram API response
      posts = instagram.user.edge_owner_to_timeline_media.edges;
    }
  } catch (err) {
    console.log(
      'Something went wrong while fetching content from Instagram',
      err,
    );
  }

  return {
    props: {
      instagram: posts,
      gallery:
        galleryData
          .filter((_, i) => i <= 8)
          .map((photo) => ({
            id: photo.ts,
            src: imageSourceFormatter(`/gallery/${photo.data.fileName}`),
            alt: photo.data.alt,
            width: photo.data.width,
            height: photo.data.height,
          })) || [],
    },
  };
}
