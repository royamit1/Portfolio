export function ProfileHeader() {
    return (
        <div className="mb-4">
            <div className="p-6">
                <div className="relative z-10">
                    <div className="mb-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-indigo-400">
              Full-Stack Developer
            </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                        Roy Amit
                    </h1>

                    <p className="text-sm md:text-base text-gray-400 leading-relaxed font-normal">
                        From mobile apps to web platforms, I bring creativity,
                        problem-solving, and adaptability to every project.
                    </p>
                </div>
            </div>

            <div className="mx-6 border-b border-sidebar-border/60"></div>
        </div>
    );
}
