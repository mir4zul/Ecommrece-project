import {
    FaLinkedin,
    FaTwitter,
    FaFacebook,
    FaInstagram,
} from "react-icons/fa6";

import logo from "@/assets/boria_1.png";
const data = [
    {
        title: "Information",
        list: [
            "Delivery Information",
            "Privacy Policy",
            "Terms & Conditions",
            "Contact Us",
            "Contact",
        ],
    },
    {
        title: "Contact",
        list: [
            "My Account",
            "Order History",
            "Address",
            "Wish List",
            "Frequently Questions",
        ],
    },
];

export default function Footer() {
    return (
        <div className="bg-secondary">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 py-12 sm:py-16 lg:py-20">
                    {data.map((item) => (
                        <div key={item.title}>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-200 uppercase">
                                    {item.title}
                                </h3>
                                <p className="h-[1px] w-5 rounded-full bg-red-600"></p>
                            </div>
                            <ul className="mt-4 space-y-2">
                                {item.list.map((list) => (
                                    <li key={list}>
                                        <a
                                            href="#"
                                            className="text-sm text-neutral-500 hover:text-red-600 hover:pl-2 duration-300 ease-in-out dark:text-gray-400 dark:hover:text-white hover:underline"
                                        >
                                            {list}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className="sm:col-span-2 lg:col-span-2">
                        <img className="w-32 mx-auto" src={logo} alt="" />
                        <div className="mt-8 space-y-3 text-center text-sm text-neutral-500">
                            <p className="hover:text-red-600 duration-200 ease-in-out">
                                Address: 4710-4890 Breckinridge St, Fayettevill
                            </p>
                            <p className="hover:text-red-600 duration-200 ease-in-out">
                                Call Us: (+800) 345 678, (+800) 123 456
                            </p>
                            <p className="hover:text-red-600 duration-200 ease-in-out">
                                Email: contact@domain.com
                            </p>
                        </div>
                        <div className="mt-4 flex gap-4 justify-center">
                            <FaTwitter className="text-neutral-500 hover:text-red-600 cursor-pointer" />
                            <FaFacebook className="text-neutral-500 hover:text-red-600 cursor-pointer" />
                            <FaInstagram className="text-neutral-500 hover:text-red-600 cursor-pointer" />
                            <FaLinkedin className="text-neutral-500 hover:text-red-600 cursor-pointer" />
                        </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-200 uppercase">
                                Sign Up For Newsletters
                            </h3>
                            <p className="h-[1px] w-5 rounded-full bg-red-600"></p>
                        </div>

                        <p className="mt-4 text-sm text-neutral-500">
                            Subscribe to our newsletter and get 20% off your
                            first purchase
                        </p>

                        <form className="mt-4">
                            <input
                                type="text"
                                placeholder="Email Address"
                                className="w-full rounded border border-neutral-700 bg-neutral-800 py-4 px-4 text-sm text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                            />
                            <button
                                type="submit"
                                className="mt-2 w-full sm:w-auto rounded bg-red-600 py-3 px-6 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
