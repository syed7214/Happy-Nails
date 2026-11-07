import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Check,
  X,
  RotateCcw,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Search,
  User,
  Lock,
} from 'lucide-react';
import {
  Booking,
  BookingStatus,
  formatDisplayDate,
  formatLocalDateISO,
  downloadBookingICS,
} from '../data/salonData';

interface AdminDashboardProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onResetDemoData: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  onUpdateStatus,
  onResetDemoData,
  onNavigateHome,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const todayISO = useMemo(() => formatLocalDateISO(new Date()), []);

  const todaysAppointmentsCount = useMemo(
    () =>
      bookings.filter(
        (b) => b.dateISO === todayISO && b.status !== 'cancelled'
      ).length,
    [bookings, todayISO]
  );

  const confirmedCount = useMemo(
    () => bookings.filter((b) => b.status === 'confirmed').length,
    [bookings]
  );

  const completedCount = useMemo(
    () => bookings.filter((b) => b.status === 'completed').length,
    [bookings]
  );

  const sortedAndFilteredBookings = useMemo(() => {
    return [...bookings]
      .filter((b) => {
        if (statusFilter !== 'all' && b.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            b.customerName.toLowerCase().includes(q) ||
            b.serviceName.toLowerCase().includes(q) ||
            b.referenceCode.toLowerCase().includes(q) ||
            b.technicianName.toLowerCase().includes(q) ||
            b.customerPhone.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (a.dateISO !== b.dateISO) {
          return a.dateISO.localeCompare(b.dateISO);
        }
        return a.timeSlot.localeCompare(b.timeSlot);
      });
  }, [bookings, statusFilter, searchQuery]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '1234') {
      setIsUnlocked(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#F6F0E9] text-[#0B3B2E] flex flex-col justify-between p-6">
        <div className="max-w-6xl w-full mx-auto pt-2">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#3F6B58] hover:text-[#0B3B2E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Happy Nails</span>
          </button>
        </div>

        <div className="max-w-sm w-full mx-auto frosted-card rounded-3xl p-8 text-center space-y-6 animate-fade-slide">
          <div className="w-12 h-12 rounded-full bg-[#0B3B2E]/10 text-[#0B3B2E] flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5 text-[#3F6B58]" />
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#3F6B58] font-medium">
              Staff Access
            </p>
            <h1 className="font-serif text-3xl font-semibold text-[#0B3B2E]">
              Salon Dashboard
            </h1>
            <p className="text-xs text-[#0B3B2E]/65">
              Enter the salon passcode to view appointments.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
            <div>
              <label htmlFor="admin-pin" className="sr-only">
                Passcode
              </label>
              <input
                id="admin-pin"
                type="password"
                inputMode="numeric"
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError(false);
                }}
                placeholder="Passcode (••••)"
                className={`w-full px-4 py-3 rounded-xl bg-white/85 border text-center tracking-[0.3em] font-mono text-base text-[#0B3B2E] placeholder:tracking-normal placeholder:font-sans placeholder:text-xs placeholder:text-[#0B3B2E]/40 focus:outline-none focus:ring-2 focus:ring-[#0B3B2E] ${
                  passwordError ? 'border-red-600' : 'border-[#0B3B2E]/15'
                }`}
              />
              {passwordError && (
                <p className="text-xs text-red-700 text-center mt-1.5" role="alert">
                  Incorrect passcode. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0B3B2E] text-[#F6F0E9] hover:bg-[#0B3B2E]/90 py-3 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer"
            >
              <span>Unlock Dashboard</span>
              <span aria-hidden="true">↗</span>
            </button>
          </form>
        </div>

        <div className="text-center text-[11px] text-[#0B3B2E]/40">
          Happy Nails <span className="text-[10px] opacity-70">✦</span> Kingston upon Thames
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F0E9] text-[#0B3B2E] flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#F6F0E9]/90 backdrop-blur-md border-b border-[#0B3B2E]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#3F6B58] hover:text-[#0B3B2E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Salon Website</span>
            </button>
            <span className="text-[#0B3B2E]/20" aria-hidden="true">
              |
            </span>
            <span className="font-serif text-xl sm:text-2xl font-semibold text-[#0B3B2E] whitespace-nowrap">
              Happy Nails <span className="text-sm text-[#3F6B58]/70">✦</span>{' '}
              <span className="text-sm font-sans font-normal text-[#3F6B58]">
                Salon Dashboard
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetDemoData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-white/80 hover:bg-white text-[#0B3B2E] border border-[#0B3B2E]/15 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Restore default sample bookings in localStorage"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#3F6B58]" />
              <span>Reset Demo Data</span>
            </button>
            <button
              type="button"
              onClick={() => setIsUnlocked(false)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-[#0B3B2E]/70 hover:text-[#0B3B2E] hover:bg-white/60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Lock dashboard"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Heading + Summary Metrics */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#3F6B58] font-medium mb-1">
              Kingston upon Thames · Reception Desk
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#0B3B2E]">
              Salon Appointments{' '}
              <span className="text-[#3F6B58] italic font-normal">
                Overview.
              </span>
            </h1>
          </div>

          <p className="text-xs text-[#0B3B2E]/70 tabular-nums">
            Today’s Date: <strong className="text-[#0B3B2E]">{formatDisplayDate(todayISO)}</strong> · Saved in localStorage
          </p>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="frosted-card rounded-3xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#3F6B58] font-semibold">
                Today’s Appointments
              </p>
              <p className="font-serif text-4xl sm:text-5xl font-semibold text-[#0B3B2E] tabular-nums mt-1">
                {todaysAppointmentsCount}
              </p>
              <p className="text-xs text-[#0B3B2E]/65 mt-1">
                Active bookings scheduled for {formatDisplayDate(todayISO)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#0B3B2E] text-[#F6F0E9] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="frosted-card rounded-3xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#3F6B58] font-semibold">
                Upcoming Confirmed
              </p>
              <p className="font-serif text-4xl sm:text-5xl font-semibold text-[#0B3B2E] tabular-nums mt-1">
                {confirmedCount}
              </p>
              <p className="text-xs text-[#0B3B2E]/65 mt-1">
                Awaiting guest arrival
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#3F6B58]/15 text-[#0B3B2E] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#3F6B58]" />
            </div>
          </div>

          <div className="frosted-card rounded-3xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#3F6B58] font-semibold">
                Completed Treatments
              </p>
              <p className="font-serif text-4xl sm:text-5xl font-semibold text-[#0B3B2E] tabular-nums mt-1">
                {completedCount}
              </p>
              <p className="text-xs text-[#0B3B2E]/65 mt-1">
                Checked out at reception
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E9C9BE]/60 text-[#0B3B2E] flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="frosted-card rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div
            className="flex items-center gap-1.5 bg-white/70 p-1 rounded-full border border-[#0B3B2E]/10 overflow-x-auto"
            role="tablist"
            aria-label="Filter appointments by status"
          >
            {(
              [
                { id: 'all', label: `All (${bookings.length})` },
                { id: 'confirmed', label: 'Confirmed' },
                { id: 'completed', label: 'Completed' },
                { id: 'cancelled', label: 'Cancelled' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={statusFilter === tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#0B3B2E] text-[#F6F0E9]'
                    : 'text-[#0B3B2E]/70 hover:text-[#0B3B2E]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-[#3F6B58] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guest, ref, or service..."
              aria-label="Search bookings"
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white/85 border border-[#0B3B2E]/15 text-xs text-[#0B3B2E] placeholder:text-[#0B3B2E]/40 focus:outline-none focus:ring-2 focus:ring-[#0B3B2E]"
            />
          </div>
        </div>

        {/* Bookings List Sorted by Date */}
        {sortedAndFilteredBookings.length === 0 ? (
          <div className="frosted-card rounded-3xl p-12 text-center space-y-3">
            <p className="font-serif text-2xl text-[#0B3B2E]">
              No appointments match this filter.
            </p>
            <p className="text-sm text-[#0B3B2E]/65">
              Try clearing your search or book a new appointment on the main salon page.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAndFilteredBookings.map((booking) => {
              const isToday = booking.dateISO === todayISO;
              return (
                <div
                  key={booking.id}
                  className={`frosted-card rounded-3xl p-5 sm:p-6 transition-all ${
                    booking.status === 'cancelled' ? 'opacity-65' : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Date, Time & Service */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#3F6B58] tabular-nums">
                        <span className="font-mono font-semibold text-[#0B3B2E]">
                          {booking.referenceCode}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#0B3B2E]">
                          {formatDisplayDate(booking.dateISO)}
                        </span>
                        {isToday && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-[#3F6B58] underline decoration-[#E9C9BE] underline-offset-4">
                              Today
                            </span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#0B3B2E]">
                          {booking.timeSlot} ({booking.durationMinutes} mins)
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-semibold capitalize ${
                            booking.status === 'completed'
                              ? 'text-[#3F6B58]'
                              : booking.status === 'cancelled'
                              ? 'text-red-700 line-through'
                              : 'text-[#0B3B2E]'
                          }`}
                        >
                          Status: {booking.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0B3B2E]">
                          {booking.serviceName}
                        </h2>
                        <span className="text-sm text-[#3F6B58] tabular-nums">
                          from £{booking.priceFrom} · Stylist: {booking.technicianName}
                        </span>
                      </div>

                      {/* Guest Details Row */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#0B3B2E]/80 pt-1">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#0B3B2E]">
                          <User className="w-3.5 h-3.5 text-[#3F6B58]" />
                          {booking.customerName}
                        </span>
                        <a
                          href={`tel:${booking.customerPhone.replace(/\s+/g, '')}`}
                          className="inline-flex items-center gap-1.5 hover:underline tabular-nums"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#3F6B58]" />
                          {booking.customerPhone}
                        </a>
                        <a
                          href={`mailto:${booking.customerEmail}`}
                          className="inline-flex items-center gap-1.5 hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#3F6B58]" />
                          {booking.customerEmail}
                        </a>
                        <span className="inline-flex items-center gap-1.5 text-[#0B3B2E]/65">
                          <MapPin className="w-3.5 h-3.5 text-[#3F6B58]" />
                          {booking.locationName}
                        </span>
                      </div>

                      {booking.notes && (
                        <p className="text-xs italic text-[#0B3B2E]/75 bg-white/60 px-3.5 py-2 rounded-xl border border-[#0B3B2E]/10 mt-2">
                          Guest Note: “{booking.notes}”
                        </p>
                      )}
                    </div>

                    {/* Right: Actions (Mark completed, Cancel, .ics) */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#0B3B2E]/10 shrink-0">
                      {booking.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(booking.id, 'completed')}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium bg-[#0B3B2E] text-[#F6F0E9] hover:bg-[#0B3B2E]/90 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark completed</span>
                        </button>
                      )}

                      {booking.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium bg-white/85 hover:bg-red-50 text-red-800 border border-red-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}

                      {booking.status !== 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-medium bg-white/80 hover:bg-white text-[#0B3B2E] border border-[#0B3B2E]/15 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          Restore
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => downloadBookingICS(booking)}
                        className="px-3.5 py-2.5 rounded-full text-xs font-medium bg-[#E9C9BE]/55 hover:bg-[#E9C9BE] text-[#0B3B2E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        title="Download .ics calendar file"
                      >
                        .ics
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
