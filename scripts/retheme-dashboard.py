from pathlib import Path

files = [
    "app/dashboard/page.tsx",
    "components/ProductForm.tsx",
    "components/CategoryManager.tsx",
    "components/BannerManager.tsx",
    "components/SettingsManager.tsx",
    "components/OrderDetailModal.tsx",
]

color_reps = [
    ("#C4A484", "#C49A52"),
    ("#B39474", "#243B5A"),
    ("#B8956F", "#243B5A"),
    ("#8B7355", "#14243D"),
    ("#6F5B44", "#243B5A"),
    ("#F5EEDC", "#EEF2F7"),
    ("#E8DFD0", "#E8D5B0"),
]

string_reps = {
    "app/dashboard/page.tsx": [
        ("Admin Login", "COSMORA Print Admin"),
        (
            "Enter your credentials to access the dashboard",
            "Sign in to manage print catalog, orders, and apparel stock",
        ),
        ("Dashboard</h1>", "Print Catalog</h1>"),
        ("Add Product", "Add Apparel"),
        ("Total Products", "Catalog Items"),
        ("Active Products", "In Stock"),
        ("New Products", "New Styles"),
        ("On Sale", "Print Offers"),
        ("Recent Products", "Recent Apparel"),
        ("No products found", "No apparel in catalog yet — add your first tee or hoodie"),
        ("Loading products...", "Loading print catalog..."),
        ("Orders & Inventory", "Print Orders"),
        ("Total Orders", "All Orders"),
        ("Pending Orders", "Pending Prints"),
        ("Completed Orders", "Delivered"),
        ("Total Revenue", "Print Revenue"),
        ("Recent Orders", "Recent Print Orders"),
        ("Admin Panel", "COSMORA Press Admin"),
        ("Welcome, Admin", "Print shop admin"),
        (
            "{ id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },",
            "{ id: 'dashboard' as const, label: 'Print Catalog', icon: LayoutDashboard },",
        ),
        (
            "{ id: 'categories' as const, label: 'Categories', icon: Filter },",
            "{ id: 'categories' as const, label: 'Apparel Types', icon: Filter },",
        ),
        (
            "{ id: 'banners' as const, label: 'Banners', icon: ImageIcon },",
            "{ id: 'banners' as const, label: 'Promo Banners', icon: ImageIcon },",
        ),
        (
            "{ id: 'settings' as const, label: 'Settings', icon: Settings },",
            "{ id: 'settings' as const, label: 'Store Settings', icon: Settings },",
        ),
        ("Product\n                </th>", "Apparel\n                </th>"),
        ("hover:bg-gray-100'", "hover:bg-[#EEF2F7]'"),
        ("min-h-screen bg-gray-50", "min-h-screen bg-[#FAFBFC]"),
        ("bg-white shadow-sm border-b border-gray-200", "bg-[#14243D] shadow-sm border-b border-[#243B5A]"),
        (
            'className="text-lg sm:text-2xl font-bold text-gray-900 truncate"',
            'className="text-lg sm:text-2xl font-bold text-white truncate"',
        ),
        (
            'className="text-xs sm:text-sm text-gray-600 hidden sm:inline"',
            'className="text-xs sm:text-sm text-[#E8D5B0] hidden sm:inline"',
        ),
        (
            'className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-700"',
            'className="md:hidden p-2 rounded-lg border border-white/20 text-white"',
        ),
        (
            "w-64 bg-white shadow-sm border-r border-gray-200",
            "w-64 bg-white shadow-sm border-r border-[#E5E7EB]",
        ),
        (
            "? 'bg-[#C49A52] text-white'\n                  : 'text-gray-700 hover:bg-[#EEF2F7]'",
            "? 'bg-[#14243D] text-white'\n                  : 'text-[#172033] hover:bg-[#EEF2F7]'",
        ),
    ],
    "components/ProductForm.tsx": [
        ("Add New Product", "Add Apparel / Tee"),
        ("Edit Product", "Edit Apparel"),
        ("Product Name *", "Apparel Name *"),
        ("Size Constraints", "Apparel Sizes (S, M, L, XL…)"),
        ("Create Product", "Add to Catalog"),
        ("Update Product", "Update Catalog Item"),
    ],
    "components/CategoryManager.tsx": [
        ("Manage Categories", "Apparel Categories"),
        ("New Category Name", "e.g. Round Neck Tees, Hoodies, Polos"),
        ("Add Category", "Add Type"),
    ],
    "components/BannerManager.tsx": [
        ("Homepage Banners", "Homepage Promo Banners"),
    ],
    "components/SettingsManager.tsx": [
        ("Store Settings", "Print Shop Settings"),
        ("Enable “Send as Gift” option", "Enable gift packaging for merch orders"),
        ("Gift wrapping / gift fee (₹)", "Gift packaging fee (₹)"),
    ],
}

for f in files:
    p = Path(f)
    t = p.read_text(encoding="utf-8")
    for a, b in color_reps:
        t = t.replace(a, b)
    for a, b in string_reps.get(f, []):
        t = t.replace(a, b)
    # After color replace, fix active tab to navy (gold was replaced to C49A52)
    if f == "app/dashboard/page.tsx":
        t = t.replace(
            "? 'bg-[#C49A52] text-white'\n                  : 'text-gray-700 hover:bg-[#EEF2F7]'",
            "? 'bg-[#14243D] text-white'\n                  : 'text-[#172033] hover:bg-[#EEF2F7]'",
        )
        t = t.replace(
            "? 'bg-[#C49A52] text-white'\n                  : 'text-gray-700 hover:bg-gray-100'",
            "? 'bg-[#14243D] text-white'\n                  : 'text-[#172033] hover:bg-[#EEF2F7]'",
        )
        # Login CTA: gold primary
        t = t.replace(
            'className="w-full bg-[#C49A52] hover:bg-[#243B5A] text-white"',
            'className="w-full bg-[#14243D] hover:bg-[#243B5A] text-white"',
        )
        t = t.replace(
            'className="mx-auto h-12 w-12 bg-[#C49A52] rounded-full flex items-center justify-center"',
            'className="mx-auto h-12 w-12 bg-[#14243D] rounded-full flex items-center justify-center"',
        )
        # Add apparel button gold accent
        t = t.replace(
            'className="bg-[#C49A52] hover:bg-[#243B5A]"',
            'className="bg-[#C49A52] hover:bg-[#A8843F] text-[#14243D] font-semibold"',
        )
    p.write_text(t, encoding="utf-8")
    print("updated", f)

print("done")
