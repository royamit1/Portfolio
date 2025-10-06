export function ProfileHeader() {
    return (
        <div className="mb-8 border-b border-sidebar-border/50">
            <div className="relative group p-6">
                <div className="relative z-10">
                    <div className="mb-4">
                        <h1 className="text-5xl font-black text-sidebar-foreground mb-1">
                            Roy Amit
                        </h1>

                        <div className="flex my-2">
              <span className="py-3 text-s font-bold text-sidebar-accent-foreground rounded-full">
                Full-Stack Developer
              </span>
                        </div>
                    </div>

                    <p className="text-sm text-sidebar-foreground/80 leading-relaxed font-medium">
                        From mobile apps to web platforms, I bring creativity, problem-solving, and adaptability to
                        every project.
                    </p>
                </div>
            </div>
        </div>
    )
}