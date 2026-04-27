const actionItems = [
  { key: "create-office",        label: "Create office",        iconBg: "bg-purple-100", iconColor: "text-purple-700", icon: "✦" },
  { key: "assign-post",        label: "Assign post to office",        iconBg: "bg-teal-100",   iconColor: "text-teal-700",   icon: "⇄" },
  { key: "create-user",        label: "Create user",        iconBg: "bg-blue-100",   iconColor: "text-blue-700",   icon: "+" },
  { key: "assign-post-user", label: "Assign post to user", iconBg: "bg-amber-100",  iconColor: "text-amber-700",  icon: "⊙" },
  { key: "manage-privileges",  label: "Manage privileges",  iconBg: "bg-red-100",    iconColor: "text-red-700",    icon: "⚙" },
  { key: "user-permission",  label: "Manage User Permission",  iconBg: "bg-red-100",    iconColor: "text-red-700",    icon: "⚙" },
];

const masterItems = [
  { key: "division",          label: "Division",         iconBg: "bg-green-100", iconColor: "text-green-700" },
  { key: "district",          label: "District",         iconBg: "bg-teal-100",  iconColor: "text-teal-700"  },
  { key: "post",              label: "Post",             iconBg: "bg-amber-100", iconColor: "text-amber-700" },
  { key: "application-type",  label: "Application type", iconBg: "bg-pink-100",  iconColor: "text-pink-700"  },
];

export default function Sidebar({ active, onSelect }) {
  const NavBtn = ({ item }) => (
    <button
      onClick={() => onSelect(item.key)}
      className={`flex items-center gap-2.5 w-full rounded-lg px-2.5 py-2 text-sm text-left mb-0.5 transition-colors cursor-pointer
        ${active === item.key ? "bg-green-50 text-green-800" : "hover:bg-gray-100 text-gray-800"}`}
    >
      <span className={`w-7 h-7 rounded-md flex items-center justify-center text-sm shrink-0 ${item.iconBg} ${item.iconColor}`}>
        {item.icon || "◈"}
      </span>
      {item.label}
    </button>
  );

  return (
    <aside className="w-1/4 min-h-screen border-r border-gray-200 bg-white px-4 py-5 shrink-0">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-purple-600" />
        <span className="text-sm font-medium">Admin Panel</span>
      </div>

      <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2 ml-1">Actions</p>
      {actionItems.map(item => <NavBtn key={item.key} item={item} />)}

      <hr className="my-4 border-gray-100" />

      <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2 ml-1">Masters</p>
      {masterItems.map(item => <NavBtn key={item.key} item={item} />)}
    </aside>
  );
}