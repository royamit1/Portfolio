export function ProfileHeader() {
    return (
        <div className="mb-8"> {/* Removed the heavy outer border-b */}
            <div className="p-6">
                <div className="relative z-10">

                    {/* The Title/Role: Smaller, Uppercase, and a "pop" of accent color */}
                    <div className="mb-2">
                        <span className="text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
                            Full-Stack Developer
                        </span>
                    </div>

                    {/* The Name: Large and heavy, but using a very dark gray for elegance */}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-none">
                        Roy Amit
                    </h1>

                    {/* The Description: Subtle and easy-to-read */}
                    <p className="mt-5 text-base text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                        From mobile apps to web platforms, I bring creativity, problem-solving, and adaptability to
                        every project.
                    </p>
                </div>
            </div>
            {/* Optional: Add a subtle separator at the bottom for final contrast/division */}
            <div className="mx-6 border-b border-gray-200 dark:border-gray-700/50"></div>
        </div>
    )
}