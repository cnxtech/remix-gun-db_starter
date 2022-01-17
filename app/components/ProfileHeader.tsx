import React from 'react';
import { Link } from 'remix';
import Avatar from './Avatar';
import Display from './DisplayHeading';

interface Props {
  size?: 'small' | 'normal' | 'big' | 'monster';
  name: string;
  img: string;
  job: string;
  desc: string;
  social?: Array<Social>;
  editMode?: boolean;
}
interface Social {
  svgPath?: string;
  to: string;
  fill?: string;
}

const ProfileHeader = (props: Props) => {
  return (
    <div className="p-4">
      <div className="text-center items-center mb-4 opacity-90">
        <Avatar size={props.size} img={props.img} />
  <Display title={props.name} span={props.job} description={props.desc} titleColor='red-500' spanColor='blue-500' />
      </div>
      <div className="pt-8 flex border-t border-gray-200 w-44 mx-auto text-gray-500 items-center justify-between">
        {props.social &&
          props.social.map((link: Social) => (
            <Link to={link.to}>
              <svg
                width="30"
                height="30"
                fill={link.fill || 'currentColor'}
                className="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={
                    link.svgPath ||
                    'M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z'
                  }
                />
              </svg>
            </Link>
          ))}
      </div>
    </div>
  );
};
export default ProfileHeader;
