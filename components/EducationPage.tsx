
import React from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface EducationPageProps {
    onBack: () => void;
}

const EducationPage: React.FC<EducationPageProps> = ({ onBack }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={onBack}
                className="flex items-center text-amber-800 hover:text-amber-900 font-semibold mb-6 transition-colors"
            >
                <ChevronLeftIcon className="h-5 w-5 mr-2" />
                Back to Search
            </button>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 space-y-8">
                <header>
                    <h1 className="text-4xl font-bold text-stone-800 mb-2">Archaeology Education Resources</h1>
                    <p className="text-stone-600 leading-relaxed">
                        Welcome to our educational corner! Archaeology is the study of the human past using material remains. These remains can be any objects that people created, modified, or used. By studying these artifacts, archaeologists can piece together the stories of our ancestors and understand how societies have evolved over millennia.
                    </p>
                </header>

                <section>
                    <h2 className="text-2xl font-bold text-stone-800 mb-4 border-b-2 border-amber-200 pb-2">What Do Archaeologists Do?</h2>
                    <p className="text-stone-700 leading-relaxed mb-4">
                        Archaeologists are like detectives of history. Their work involves careful excavation of sites, analysis of artifacts in laboratories, and interpretation of their findings to build a picture of the past. They study everything from grand temples to simple pottery shards to learn about daily life, trade, religion, and the social structures of ancient cultures.
                    </p>
                </section>

                <section className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                    <h2 className="text-2xl font-bold text-red-800 mb-4">The Importance of Preservation</h2>
                    <h3 className="text-xl font-semibold text-stone-800 mb-3">Looting, Destruction, and Unlawful Removal</h3>
                    <p className="text-stone-700 leading-relaxed mb-4">
                        Archaeological sites and artifacts are a non-renewable resource. Once a site is destroyed or an artifact is removed from its original context, the historical information it holds is lost forever. The context—where an artifact is found, what it's found with, and its position in the soil—is just as important as the artifact itself.
                    </p>
                    <p className="text-stone-700 leading-relaxed mb-4">
                        **Looting**, the illegal and unscientific digging of sites to find valuable artifacts for sale, destroys this context. It robs us all of our shared heritage. Similarly, **destruction** of sites through construction, conflict, or neglect erases entire chapters of human history.
                    </p>
                    <p className="text-stone-700 leading-relaxed">
                        Even the **unknowing or knowing removal** of a 'souvenir' from a historical site contributes to this loss. Every piece is part of a larger puzzle. When you visit a historical site, the best way to preserve it is to take only pictures and leave only footprints. If you find an artifact, the best course of action is to report it to local authorities or an archaeological body so it can be properly studied and preserved for future generations.
                    </p>
                </section>
                
                <section>
                    <h2 className="text-2xl font-bold text-stone-800 mb-4 border-b-2 border-amber-200 pb-2">How You Can Help</h2>
                     <ul className="list-disc list-inside text-stone-700 leading-relaxed space-y-2">
                        <li><strong>Be a responsible tourist:</strong> Respect the rules at historical sites and museums. Never touch artifacts unless permitted.</li>
                        <li><strong>Report suspicious activity:</strong> If you see someone digging illegally or trying to sell ancient artifacts, report them to the authorities.</li>
                        <li><strong>Support ethical organizations:</strong> Donate to or volunteer with museums and archaeological organizations that work to preserve cultural heritage.</li>
                        <li><strong>Educate yourself and others:</strong> The more people understand the importance of our shared past, the better we can protect it.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default EducationPage;
