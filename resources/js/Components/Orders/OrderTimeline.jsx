import {
    CheckCircleIcon,
    ClockIcon,
    CubeIcon,
    TruckIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

const steps = [
    {
        key: "confirmed",
        label: "Confirmed",
        description: "Order accepted",
        icon: CheckCircleIcon,
    },
    {
        key: "processing",
        label: "Processing",
        description: "Preparing products",
        icon: CubeIcon,
    },
    {
        key: "shipped",
        label: "Shipped",
        description: "Handed to courier",
        icon: TruckIcon,
    },
    {
        key: "delivered",
        label: "Delivered",
        description: "Delivered to customer",
        icon: CheckCircleIcon,
    },
];
const flow = ["pending", ...steps.map((step) => step.key), "completed"];

const statusDate = (order, status) => {
    const directDates = {
        confirmed: order.confirmed_at,
        shipped: order.shipped_at,
        delivered: order.delivered_at,
    };
    const history = [...(order.histories ?? [])]
        .reverse()
        .find((item) => item.to_status === status);
    return directDates[status] ?? history?.created_at ?? null;
};

export default function OrderTimeline({ order, showPlaced = true }) {
    const currentIndex = flow.indexOf(
        order.status === "completed" ? "completed" : order.status,
    );
    const timelineSteps = showPlaced
        ? [
              {
                  key: "pending",
                  label: "Order Placed",
                  description: "We received the order",
                  icon: ClockIcon,
              },
              ...steps,
          ]
        : steps;

    if (order.status === "cancelled") {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                <div className="flex items-center gap-3">
                    <XCircleIcon className="size-7" />
                    <div>
                        <p className="font-bold">Order Cancelled</p>
                        <p className="text-sm">
                            {order.cancelled_at
                                ? new Date(order.cancelled_at).toLocaleString()
                                : "This order will not be delivered."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[680px] grid-cols-5">
                {timelineSteps.map((step, index) => {
                    const stepIndex = flow.indexOf(step.key);
                    const complete = currentIndex >= stepIndex;
                    const current = order.status === step.key;
                    const date =
                        step.key === "pending"
                            ? order.ordered_at
                            : statusDate(order, step.key);
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.key}
                            className="relative px-2 text-center"
                        >
                            {index > 0 && (
                                <span
                                    className={`absolute right-1/2 top-5 h-1 w-full -translate-y-1/2 ${complete ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`}
                                />
                            )}
                            <span
                                className={`relative z-10 mx-auto flex size-10 items-center justify-center rounded-full border-4 ${complete ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800"} ${current ? "ring-4 ring-emerald-100 dark:ring-emerald-900" : ""}`}
                            >
                                <Icon className="size-5" />
                            </span>
                            <p
                                className={`mt-3 text-sm font-bold ${complete ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500"}`}
                            >
                                {step.label}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                {step.description}
                            </p>
                            <p className="mt-1 min-h-4 text-[11px] font-medium text-slate-400">
                                {date
                                    ? new Date(date).toLocaleString()
                                    : "Waiting"}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
