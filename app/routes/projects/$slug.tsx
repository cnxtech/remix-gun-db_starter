import { ActionFunction, Form, Link, LoaderFunction } from 'remix';
import JobCard from '~/components/elements/data/JobCard';
import PaymentCard from '~/components/elements/data/PaymentCard';
import ProfileHeader from '~/components/ProfileHeader';
import { paths } from '~/components/svg/logos/SvgIcon';
export let loader: LoaderFunction = async () => {
  return null;
};
///////////////
export let action: ActionFunction = async () => {
  return null;
};
///////////////
export default function ProjectSlug() {
  // let transition = useTransition();
  // let pendingForm = transition.submission;

  // let variantId = product.variants.edges[0].node.id;
  // let image = product.images.edges[0].node;

  return (
    <main className="px-4 mx-auto max-w-7xl pt-14 sm:pt-24 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-7 lg:gap-x-10 xl:gap-x-20">
        <div className="overflow-hidden lg:grid  lg:grid-rows-2 rounded-lg aspect-w-4 aspect-h-3">
          {' '}
          <ProfileHeader
            img=""
            size="normal"
            name="profile"
            desc="Profile"
            job="profile"
            social={paths}
          />
        </div>
        <div className="lg:col-span-4">
          <div className="overflow-hidden bg-gray-100 rounded-lg aspect-w-4 aspect-h-3">
            <PaymentCard />
            <JobCard />
            {/* <img
              src={'/images/landscape/5.svg'}
              className="object-cover object-center "
              alt={'EvTev'}
            /> */}
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:col-span-3">
          <div className="flex flex-col-reverse">
            <div>
              <h1 className="text-5xl  font-extrabold tracking-tight text-blue-500 sm:text-3xl">
                Title
              </h1>
              <h2 id="information-heading" className="sr-only">
                Product information
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                product.tags.join Updated
                <time dateTime={'2/18/1899'}>
                  formatparseISOproduct.updatedAt, 'dd MMM yyyy')
                </time>
              </p>
            </div>
          </div>
          <p className="mt-6 text-gray-500">product.description</p>
          <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-4 sm:grid-cols-2">
            <Form method="post">
              <fieldset disabled={false}>
                <input type="hidden" name="variantId" value={'variantId'} />
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-gray-900 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
                >
                  {/* ÷ */}
                  <svg
                    className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {/* )} */}
                  <span>Pay 31.00</span>
                </button>
              </fieldset>
            </Form>
            <button
              type="button"
              className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-gray-900 bg-white border rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
            >
              Preview
            </button>
          </div>
          <div className="pt-10 sm:border-t sm:mt-10">
            <h3 className="text-sm font-medium text-gray-900">License</h3>
            <p className="mt-4 text-sm text-gray-500">
              For personal and professional use. You cannot resell or
              redistribute these icons in their original or modified state.{' '}
              <a
                href="#"
                className="font-medium text-gray-900 hover:text-gray-700"
              >
                Read full license
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto mt-24 lg:mt-32 lg:max-w-none">
        <div className="flex items-center justify-between space-x-4">
          <h2 className="text-lg font-medium text-gray-900">
            Customers also viewed
          </h2>
          <Link
            className="text-sm font-medium text-gray-900 whitespace-nowrap hover:text-gray-700"
            to="/"
          >
            View all<span aria-hidden="true"> →</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 mt-6 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          {/* {relatedProducts.map((relatedProduct) => {
            let product = relatedProduct.node;
            const image = product.images.edges[0].node;

            return (
              <div className="relative group" key={product.handle}>
                <div className="overflow-hidden bg-gray-100 rounded-lg aspect-w-4 aspect-h-3">
                  <img
                    src={image.transformedSrc}
                    className="object-cover object-center group-hover:opacity-75"
                    alt={image.altText ?? ''}
                  />
                </div>
                <div className="flex items-center justify-between mt-4 space-x-8 text-base font-medium text-gray-900">
                  <h3>
                    <Link to={`/products/${product.handle}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </Link>
                  </h3>
                  <p>
                    {formatMoney(
                      Number(product.priceRange.minVariantPrice.amount)
                    )}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {product.tags.join(', ')}
                </p>
              </div>
            );
          })} */}
        </div>
      </div>
    </main>
  );
}
