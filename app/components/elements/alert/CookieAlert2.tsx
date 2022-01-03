import React from 'react';
import { Link } from 'remix';
import Button from '../buttons/Button';


interface Props {
    link: {privacy:string, button:string}
    img: string
    
}

const CookieAlert2 = ({link, img}: Props) => {
    return (
        <div className="w-72 bg-white rounded-lg shadow-md p-6">
            <div className="w-16 mx-auto relative -mt-10 mb-3">
                <img className="-mt-1" src={img} alt="cookie" />
            </div>

            <span className="w-full sm:w-48  block leading-normal text-gray-800 text-md mb-3">
                We care about your data, and we'd love to use cookies to make your experience better.
            </span>

            <div className="flex items-center justify-between">
                <Link className="text-xs text-gray-400 mr-1 hover:text-gray-800" to={link.privacy}>
                    Privacy Policy
                </Link>
                <div className="w-1/2">
                    <Link to={link.button} >
                    <Button label="See more" color="indigo" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CookieAlert2;
