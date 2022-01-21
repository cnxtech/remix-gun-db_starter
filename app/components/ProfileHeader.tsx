import { Link } from 'remix';
import Avatar from './Avatar';
import Display from './DisplayHeading';
import SvgIcon from './svg/logos/SvgIcon';

interface Props {
  size?: 'small' | 'normal' | 'big' | 'monster';
  name: string;
  img: string;
  job: string;
  desc: string;
  social?: Array<Social>;
  editMode?: boolean;
  className?: string;
}
interface Social {
  svgPath?: string;
  to: string;
  fill?: string;
}

const ProfileHeader = (props: Props) => {
  return (
    <div>
      <Display
        title={props.name}
        span={props.job}
        description={props.desc}
        titleColor="red-500"
        spanColor="blue-500"
      />
      <div className="text-center items-center mb-4 opacity-90">
        <Avatar size={props.size} img={props.img} />
      </div>
      <div className="pt-8 flex border-t border-gray-200 w-44 mx-auto text-gray-500 items-center justify-between">
        {props.social &&
          props.social.map((link: Social) => (
            <Link to={link.to}>
              <SvgIcon path={link.svgPath} fill={'blue'} size={'20'} />
            </Link>
          ))}
        {/* <H1 title={props.name} span={props.job} /> */}
      </div>
    </div>
  );
};
export default ProfileHeader;
