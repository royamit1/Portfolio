export function ProfileHeader() {
    return (
        <div className="mb-8">
            <div className="p-6">
                <div className="relative z-10">

                    <div className="mb-2">
                        <span className="text-xs font-semibold tracking-widest uppercase text-indigo-400">
                            Full-Stack Developer
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-none">
                        Roy Amit
                    </h1>

                    <p className="mt-5 text-base text-gray-400 leading-relaxed font-normal">
                        From mobile apps to web platforms, I bring creativity, problem-solving, and adaptability to
                        every project.
                    </p>
                </div>
            </div>

            <div className="mx-6 border-b border-gray-700/50"></div>
        </div>
    )
}