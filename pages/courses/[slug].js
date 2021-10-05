import ReactMarkdown from "react-markdown";
import Moment from "react-moment";
import { fetchAPI } from "../../utils/urls";
import Layout from "../../components/blog/layout";
import Image from "../../components/blog/image";
import Seo from "components/elements/seo"
import { getStrapiMedia } from "../../utils/urls";
import Hero from "@/components/sections/hero";


const Course = ({ course, categories }) => {
  const imageUrl = getStrapiMedia(course.image);
const metadata = course.metadata
//console.log("article in the article slug", article)
//console.log("article metadata in the article slug", metadata )
 /* const seo = {
    metaTitle: article.title,
    metaDescription: article.description,
    shareImage: article.image,
    article: true,
  }; */

  return (
    <Layout categories={categories}>
      {console.log("metadata in the slug return statement", metadata)}
      <Seo metadata={metadata} />
      <Hero data={course.header}/>
      <div
        id="banner"
        className="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light uk-padding uk-margin"
        data-src={imageUrl}
        data-srcset={imageUrl}
        data-uk-img
      >
        <h1>{course.title}</h1>
      </div>
      <div className="uk-section">
        <div className="uk-container uk-container-small">
          <ReactMarkdown source={course.description} escapeHtml={false} />
          <hr className="uk-divider-small" />
          <div className="uk-grid-small uk-flex-left" data-uk-grid="true">
         {/*   <div>
              {course.author.picture && (
                <Image
                  image={course.author.picture}
                  style={{
                    position: "static",
                    borderRadius: "50%",
                    height: 30,
                  }}
                />
              )}
                </div> */}
            <div className="uk-width-expand">
             {/* <p className="uk-margin-remove-bottom">
                By {course.author.name}
              </p> */}
              <p className="uk-text-meta uk-margin-remove-top">
                <Moment format="MMM Do YYYY">{course.published_at}</Moment>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticPaths() {
  const courses = await fetchAPI("/courses");
console.log("Courses in courses slug", courses)
  return {
    paths: courses.map((course) => ({
      params: {
        slug: course.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const courses = await fetchAPI(
    `/courses?slug=${params.slug}&status=published`
  );
  console.log("Courses in the getStaticProps of courses slug", courses)
  const categories = await fetchAPI("/categories");

  return {
    props: { course: courses[0], categories },
    revalidate: 1,
  };
}

export default Course;
