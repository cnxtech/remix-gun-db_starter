import React from 'react';
import BlogCard from './BlogCard';
import {blogs} from '../../lib/utils/data/helpers'

interface Props {
  withSearch?: boolean;
  userId: string;
  alias?: string;
 
}




const BlogList = (props: Props) => {

  return (
    <div className="w-full  p-12">
      <div className="header flex items-end justify-between mb-12">
        <div className="title">
          <p className="text-4xl font-bold text-gray-800 mb-4">
              TAGS/Projects
          </p>

          <p className="text-2xl font-light text-gray-400">
            This is where the user tags will be
          </p>
        </div>
        {props.withSearch && <div className="text-end"></div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {blogs.map((blog) => {
          return (
            <BlogCard
              key={blog.title}
              tags={blog.tags}
              title={blog.title}
              categ={blog.categ}
              img={blog.img}
              desc={blog.desc}
              showAuthor={true}
              userId={props.userId}
              alias={props.alias}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BlogList;
