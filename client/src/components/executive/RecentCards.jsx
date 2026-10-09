import {
    Building2,
    Clock,
    Inbox,
    Mail,
    MapPin,
    Phone,
    Target,
} from "lucide-react";

const formatDate = (value) => {
    const d = new Date(value);
    if (!value || Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

/* one detail row: icon + value (wraps safely on small screens) */
const Row = ({ icon: Icon, mobiletext = "text-slate-600", children }) => (
    <div className="flex min-w-0 items-start gap-2.5 text-sm text-slate-600">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

        <div className={`min-w-0 flex-1  wrap-break-word ${mobiletext}`}>
            {children}
        </div>
    </div>
);

const ContactCard = ({ card }) => {
    const name = card.customerName || "Unknown";
    const date = formatDate(card.createdAt);

    return (
        <article className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            {/* top: avatar + name + date */}
            <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold uppercase text-red-600">
                    {name[0]}
                </span>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold capitalize text-slate-900 sm:text-base">
                        {name}
                    </h3>
                    {card.companyName ? (
                        <p className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{card.companyName}</span>
                        </p>
                    ) : null}
                </div>

                {date && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                        <Clock className="h-3 w-3" />
                        {date}
                    </span>
                )}
            </div>

            {/* details */}
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
                {card.mobileNo ? (
                    <Row
                        icon={Phone}
                        iconClass="text-red-400"
                        mobiletext="text-red-600"
                    >
                        <a
                            href={`tel:${card.mobileNo} `}
                            className="font-medium text-slate-700 hover:text-red-600  "
                        >
                            {card.mobileNo}
                        </a>
                    </Row>
                ) : null}

                {card.email ? (
                    <Row icon={Mail}>
                        <a
                            href={`mailto:${card.email}`}
                            className="break-all hover:text-red-600"
                        >
                            {card.email}
                        </a>
                    </Row>
                ) : null}

                {card.city ? <Row icon={MapPin}>{card.city}</Row> : null}
            </div>

            {/* requirement */}
            {card.requirement ? (
                <div className="flex min-w-0 items-start gap-2 rounded-xl bg-red-50/60 px-3 py-2 text-xs text-slate-700">
                    <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                    <p className="line-clamp-3 min-w-0 wrap-break-word">
                        {card.requirement}
                    </p>
                </div>
            ) : null}
        </article>
    );
};

const RecentCards = ({ cards = [] }) => {
    const list = cards.filter(Boolean);

    return (
        <section>
            <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                    Recent Contacts
                </h2>
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                    {list.length}
                </span>
            </div>

            {list.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                        <Inbox className="h-6 w-6" />
                    </span>
                    <p className="text-sm text-slate-500">
                        No contacts saved yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                    {list.map((card, i) => (
                        <ContactCard key={card._id || i} card={card} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default RecentCards;
