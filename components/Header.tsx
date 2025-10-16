import React from 'react';

interface HeaderProps {
    // No props are needed anymore
}

const Header: React.FC<HeaderProps> = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                 <div className="flex justify-between items-center">
                    <div className="text-left flex-1">
                         {/* This can be a placeholder or removed if we want the title centered */}
                    </div>
                    <div className="text-center flex-1">
                        <h1 className="text-4xl font-bold text-stone-800 tracking-wider">ArchaeoSeeker</h1>
                        <p className="text-stone-500 mt-1">Unearthing the stories of our past.</p>
                    </div>
                    <div className="text-right flex-1">
                         {/* Button was removed from here */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;