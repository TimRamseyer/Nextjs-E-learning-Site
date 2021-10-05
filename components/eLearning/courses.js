import Link from 'next/link'
import styles from '../../styles/Home.module.css'
import { fromImageToUrl, API_URL} from '../../utils/urls'
import { twoDecimals } from 'utils/format'


const AllCourses =  (data) => {
    
   // const course_res = await fetch(`${API_URL}/courses/`)
  // const courses = await course_res.json()
    console.log("Courses in the courses page", data.data) 
       return (
   <div className="uk-grid uk-child-width-1-4@s uk-flex-center uk-text-center" >
   
         {data.data.courses.map(course => (
   
   
     <div key={course.name} className={styles.product}>
         <Link href={`/courses/${course.slug}`}>
           <a>
           <div className="uk-card uk-card-hover uk-card-default">
          
           <div className="uk-card-media-top">
              
               <img src={fromImageToUrl(course.image)} alt={course.image.alternativeText} />
              
               </div>
               
               <div className="uk-card-body">
                   <h2>{course.name}</h2>
                ${twoDecimals(course.course_price)} 
            {/* <ProductPrice product={product} /> */}
               </div>
               </div>
           </a>
         </Link>
   </div>
   
   
   
   
         )
           )}
     
   </div>
       ) 
     }

     export default AllCourses