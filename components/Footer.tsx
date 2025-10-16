
import React from 'react';

interface FooterProps {
    onAdminLogin: () => void;
    onRequestAddition: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminLogin, onRequestAddition }) => {
    return (
        <footer className="bg-stone-900 text-stone-400 mt-auto border-t border-stone-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {/* Column 1: About */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">ArchaeoSeeker</h3>
                        <p className="text-sm">
                            Dedicated to cataloging the world's greatest archaeological treasures and making history accessible to everyone.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Contribute</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <span 
                                    onClick={onRequestAddition}
                                    className="cursor-pointer hover:text-amber-400 transition-colors duration-200"
                                >
                                    Request an Addition/Edit
                                </span>
                            </li>
                            <li>
                                <span
                                    onClick={onAdminLogin}
                                    className="cursor-pointer hover:text-amber-400 transition-colors duration-200"
                                >
                                    Login
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Disclaimer */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Notice</h3>
                        <p className="text-sm">
                            We aim for the highest level of accuracy. If you find an error or wish to suggest an addition, please use the 'Request an Addition/Edit' tool. Thank you for your understanding.
                        </p>
                        <p className="text-sm">
                            This information is for educational use only, drawn from public sources. Credit is given to the original content creator(s). To request content removal or receive the source list for a specific item, please contact us.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 border-t border-stone-700 text-center text-xs">
                    <p>&copy; {new Date().getFullYear()} ArchaeoSeeker. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
