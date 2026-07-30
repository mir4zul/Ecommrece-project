import clsx from "clsx";

export function Button({
    as: Component = "button",
    borderRadius = "1.75rem",
    className,
    children,
    ...props
}) {
    return (
        <div
            className="moving-border-shell group/moving-border relative h-full overflow-hidden p-[2px]"
            style={{ borderRadius }}
        >
            <span
                aria-hidden="true"
                className="moving-border-beam pointer-events-none absolute"
            />
            <Component
                {...props}
                className={clsx(
                    "relative z-10 block h-full w-full overflow-hidden",
                    className,
                )}
                style={{ borderRadius: `calc(${borderRadius} - 2px)` }}
            >
                {children}
            </Component>
        </div>
    );
}
