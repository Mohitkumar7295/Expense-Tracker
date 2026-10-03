import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  PieChart,
  CheckCircle2,
  Utensils,
  BookOpen,
  Bus,
  ShoppingBag,
  TrendingDown,
  Lock,
  Smartphone,
  Wallet,
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-slate-50 text-slate-900 min-h-screen">
      {/* Background Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-16 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-sky-300/15 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-medium mb-8 shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Designed specifically for students</span>
          <span className="text-blue-300">•</span>
          <span className="font-semibold">Simple & Secure</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] max-w-4xl mx-auto">
          Track Your Expenses <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Manage Your Money
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The clean, fast expense tracker built for college and university students.
          Log daily food, travel, and supplies in seconds, stay inside your monthly budget, and avoid end-of-month financial stress.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/35 active:scale-95 transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all"
          >
            Sign In to Account
          </Link>
        </div>

        {/* Value Proposition Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Forever for Students
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Email OTP Verification
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Ads & Zero Bloat
          </span>
        </div>

        {/* Interactive App Preview Showcase Card */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="relative rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-200/60 to-slate-100/30 border border-slate-200/80 shadow-2xl shadow-blue-900/5">
            <div className="rounded-xl bg-white border border-slate-100 p-5 sm:p-7 text-left shadow-xs overflow-hidden">
              {/* Fake Window Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="ml-2 text-xs font-semibold text-slate-400 tracking-wider">EXPENSETRACK DASHBOARD</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">Live Preview</div>
              </div>

              {/* Mock Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Good Morning, Student</h3>
                  <p className="text-xs sm:text-sm text-slate-500">Here is your current monthly spending status.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <TrendingDown className="w-3.5 h-3.5" /> ₹3,550 Remaining in Budget
                </span>
              </div>

              {/* Mock Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="rounded-xl bg-rose-50/50 border border-rose-100 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">Spent This Month</span>
                  <div className="mt-1.5 text-2xl font-extrabold text-slate-900">₹8,450</div>
                  <div className="mt-2 w-full bg-rose-200/60 rounded-full h-1.5">
                    <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                </div>
                <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Monthly Budget</span>
                  <div className="mt-1.5 text-2xl font-extrabold text-slate-900">₹12,000</div>
                  <div className="mt-2 text-[11px] text-slate-500">Student Target Limit</div>
                </div>
                <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Safe to Spend</span>
                  <div className="mt-1.5 text-2xl font-extrabold text-emerald-700">₹3,550</div>
                  <div className="mt-2 text-[11px] text-emerald-600 font-medium">On track for this month</div>
                </div>
              </div>

              {/* Mock Recent Expenses List */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Student Expenses</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-100 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Utensils className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">Hostel Mess Dinner</div>
                        <div className="text-[11px] text-slate-400">Food • UPI • Today</div>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">₹450</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-100 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Bus className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">Campus Metro Card</div>
                        <div className="text-[11px] text-slate-400">Transport • UPI • Yesterday</div>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">₹80</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-100 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">Semester Exam Reference Books</div>
                        <div className="text-[11px] text-slate-400">Education • Cash • 01 Oct</div>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">₹500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs sm:text-sm font-bold text-blue-600 tracking-wider uppercase">Features</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything students need. Nothing they don't.
            </p>
            <p className="mt-4 text-base text-slate-600">
              Built from the ground up to solve the real problem: knowing how much money you have left before the month ends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:bg-white hover:shadow-lg hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Log any expense in under 5 seconds with built-in student categories like Food, Transport, Hostel, Books, and Shopping.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:bg-white hover:shadow-lg hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Simple & Intuitive</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                No complex spreadsheets, no confusing investment jargon. Get real-time feedback on your monthly budget and remaining cash.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:bg-white hover:shadow-lg hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Protected by 6-digit email OTP verification during registration, BCrypt password hashing, and stateless JWT tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs sm:text-sm font-bold text-blue-600 tracking-wider uppercase">How It Works</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Up and running in 3 quick steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative rounded-2xl bg-white border border-slate-200 p-8 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center mb-6 text-base">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Create & Verify Account</h3>
            <p className="text-sm text-slate-600">
              Sign up with your email and password, then verify the 6-digit OTP code sent directly to your inbox.
            </p>
          </div>

          <div className="relative rounded-2xl bg-white border border-slate-200 p-8 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center mb-6 text-base">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Set Budget & Log Expenses</h3>
            <p className="text-sm text-slate-600">
              Set your target allowance and quickly record expenses by category (Food, Travel, Bills, Hostel) and payment method.
            </p>
          </div>

          <div className="relative rounded-2xl bg-white border border-slate-200 p-8 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center mb-6 text-base">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Monitor Remaining Balance</h3>
            <p className="text-sm text-slate-600">
              Check your dashboard whenever you want to know if you can afford that weekend outing or extra treat.
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 sm:p-14 text-center shadow-xl shadow-blue-600/20">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take Control of Your Expenses?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-xl mx-auto">
            Join other students who track their expenses and stay on budget effortlessly every month.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-md hover:bg-blue-50 active:scale-95 transition"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/20 active:scale-95 transition backdrop-blur-xs"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Polished Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">ExpenseTrack</span>
            <span className="text-xs text-slate-400 ml-2">© 2026 ExpenseTrack. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/#features" className="hover:text-blue-600 transition">Features</Link>
            <Link href="/login" className="hover:text-blue-600 transition">Login</Link>
            <Link href="/register" className="hover:text-blue-600 transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
