export function TypingIndicator() {
    return (
        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 px-5 duration-300">
            <div className="max-w-[80%] py-2">
                <div className="flex gap-1.5">
          <span
              className="h-2 w-2 rounded-full bg-muted-foreground/40"
              style={{
                  animation: "pulse 1.4s ease-in-out infinite",
              }}
          />
                    <span
                        className="h-2 w-2 rounded-full bg-muted-foreground/40"
                        style={{
                            animation: "pulse 1.4s ease-in-out 0.2s infinite",
                        }}
                    />
                    <span
                        className="h-2 w-2 rounded-full bg-muted-foreground/40"
                        style={{
                            animation: "pulse 1.4s ease-in-out 0.4s infinite",
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
