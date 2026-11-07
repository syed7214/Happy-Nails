import React, { useState, useMemo, useEffect } from 'react';
import {
  Check,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  X,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';
import {
  SERVICES,
  TECHNICIANS,
  LOCATIONS,
  Booking,
  getNext14Days,
  generateTimeSlotsForDate,
  formatDisplayDate,
  saveNewBooking,
  downloadBookingICS,
} from '../data/salonData';
import { ResilientImage } from './ResilientImage';

interface BookingFlowProps {
  selectedServiceIds: string[];
  onToggleServiceId: (id: string) => void;
  selectedLocationId: string;
  onSelectLocationId: (id: string) => void;
  existingBookings: Booking[];
  onBookingCreated: (booking: Booking) => void;
  onCancelBooking?: (bookingId: string) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  selectedServiceIds,
  onToggleServiceId,
  selectedLocationId,
  onSelectLocationId,
  existingBookings,
  onBookingCreated,
  onCancelBooking,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [technicianId, setTechnicianId] = useState<string>('any');

  const next14Days = useMemo(() => getNext14Days(), []);
  const [selectedDateISO, setSelectedDateISO] = useState<string>(
    next14Days[0]?.dateISO || ''
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Customer form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const selectedServices = useMemo(() => {
    const matched = SERVICES.filter((s) => selectedServiceIds.includes(s.id));
    return matched;
  }, [selectedServiceIds]);

  const activeServicesForCalc = useMemo(
    () => (selectedServices.length > 0 ? selectedServices : [SERVICES[1]]),
    [selectedServices]
  );

  const totalDurationMinutes = useMemo(
    () =>
      activeServicesForCalc.reduce((sum, s) => sum + s.durationMinutes, 0),
    [activeServicesForCalc]
  );

  const totalPriceFrom = useMemo(
    () => activeServicesForCalc.reduce((sum, s) => sum + s.priceFrom, 0),
    [activeServicesForCalc]
  );

  const combinedServiceNames = useMemo(
    () => activeServicesForCalc.map((s) => s.name).join(' + '),
    [activeServicesForCalc]
  );

  const selectedTechnician = useMemo(
    () => TECHNICIANS.find((t) => t.id === technicianId) || TECHNICIANS[0],
    [technicianId]
  );

  const selectedLocation = useMemo(
    () => LOCATIONS.find((l) => l.id === selectedLocationId) || LOCATIONS[0],
    [selectedLocationId]
  );

  const timeSlots = useMemo(
    () =>
      generateTimeSlotsForDate(
        selectedDateISO,
        totalDurationMinutes,
        selectedLocation.id,
        selectedTechnician.id,
        existingBookings
      ),
    [
      selectedDateISO,
      totalDurationMinutes,
      selectedLocation.id,
      selectedTechnician.id,
      existingBookings,
    ]
  );

  // Auto-select first available time slot when date or service changes if current selection is invalid
  useEffect(() => {
    const currentStillValid = timeSlots.some(
      (s) => s.time === selectedTimeSlot && s.available
    );
    if (!currentStillValid) {
      const firstOpen = timeSlots.find((s) => s.available);
      setSelectedTimeSlot(firstOpen ? firstOpen.time : '');
    }
  }, [timeSlots, selectedTimeSlot]);

  // If today has no remaining available slots (e.g. late evening), default to tomorrow
  useEffect(() => {
    if (
      selectedDateISO === next14Days[0]?.dateISO &&
      timeSlots.every((s) => !s.available) &&
      next14Days[1]
    ) {
      setSelectedDateISO(next14Days[1].dateISO);
    }
  }, [selectedDateISO, timeSlots, next14Days]);

  const validateStep3 = (): boolean => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};
    if (!customerName.trim() || customerName.trim().length < 2) {
      newErrors.name = 'Please enter your full name.';
    }
    const cleanPhone = customerPhone.replace(/[\s\-()]/g, '');
    if (!/^(?:\+44|0)[1-9]\d{8,9}$/.test(cleanPhone) && cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid UK phone number (e.g. 07700 900412).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      newErrors.email = 'Please enter a valid email address for your confirmation.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const created = saveNewBooking({
      serviceId: activeServicesForCalc.map((s) => s.id).join(','),
      serviceName: combinedServiceNames,
      durationMinutes: totalDurationMinutes,
      priceFrom: totalPriceFrom,
      technicianId: selectedTechnician.id,
      technicianName: selectedTechnician.name,
      locationId: selectedLocation.id,
      locationName: selectedLocation.name,
      locationAddress: selectedLocation.fullAddress,
      dateISO: selectedDateISO,
      timeSlot: selectedTimeSlot,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      notes: customerNotes.trim() || undefined,
    });

    setConfirmedBooking(created);
    onBookingCreated(created);
    setStep(4);
  };

  const handleResetFlow = () => {
    setConfirmedBooking(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerNotes('');
    setErrors({});
    setIsDetailsModalOpen(false);
    setStep(1);
  };

  const availableSlotCount = timeSlots.filter((s) => s.available).length;

  return (
    <div className="w-full">
      {/* Stepper Header (Steps 1-3) */}
      {step < 4 && (
        <div className="mb-8">
          <div
            className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto"
            role="navigation"
            aria-label="Booking progress"
          >
            {[
              { num: 1, label: 'Choose Service' },
              { num: 2, label: 'Select Time' },
              { num: 3, label: 'Confirm' },
            ].map((item) => {
              const isActive = step === item.num;
              const isDone = step > item.num;
              return (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => {
                    if (selectedServices.length === 0 && item.num > 1) return;
                    setStep(item.num as 1 | 2 | 3);
                  }}
                  className={`group flex flex-col items-start text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B2E] ${
                    isActive
                      ? 'frosted-card border-[#0B3B2E]/30 shadow-sm ring-1 ring-[#0B3B2E]/20'
                      : isDone
                      ? 'bg-white/60 hover:bg-white/85 border border-white/80'
                      : 'bg-white/45 hover:bg-white/75 border border-white/60 opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#3F6B58] font-medium">
                      Step 0{item.num}
                    </span>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium tabular-nums transition-colors ${
                        isDone
                          ? 'bg-[#3F6B58] text-[#F6F0E9]'
                          : isActive
                          ? 'bg-[#0B3B2E] text-[#F6F0E9]'
                          : 'bg-[#0B3B2E]/10 text-[#0B3B2E]/60'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5" /> : item.num}
                    </span>
                  </div>
                  <span className="font-serif text-base sm:text-lg font-semibold text-[#0B3B2E] whitespace-nowrap truncate w-full">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: CHOOSE SERVICE (Multi-select enabled) */}
      {step === 1 && (
        <div className="animate-fade-slide space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <p className="text-xs uppercase tracking-[0.16em] text-[#3F6B58] font-medium">
              Select one or multiple treatments to combine in your visit
            </p>
            <span className="text-xs font-medium text-[#0B3B2E] tabular-nums">
              {selectedServices.length}{' '}
              {selectedServices.length === 1 ? 'treatment' : 'treatments'} selected
            </span>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            role="group"
            aria-label="Select one or more treatments"
          >
            {SERVICES.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => onToggleServiceId(service.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onToggleServiceId(service.id);
                    }
                  }}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  className={`group cursor-pointer rounded-3xl overflow-hidden interactive-panel flex flex-col justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B2E] ${
                    isSelected
                      ? 'frosted-card ring-2 ring-[#0B3B2E] bg-white/90'
                      : 'frosted-card hover:bg-white/85'
                  }`}
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E9C9BE]/30">
                      <ResilientImage
                        src={service.bookingImageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B2E]/50 via-transparent to-transparent" />
                      <div className="absolute top-3.5 right-3.5">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#0B3B2E] text-[#F6F0E9] shadow-md scale-105'
                              : 'bg-white/80 text-[#0B3B2E] backdrop-blur-md'
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <span className="w-3 h-3 rounded-sm border border-[#0B3B2E]/50" />
                          )}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 flex items-baseline justify-between text-[#F6F0E9]">
                        <span className="text-xs uppercase tracking-[0.16em] bg-[#0B3B2E]/75 backdrop-blur-sm px-2.5 py-1 rounded-md tabular-nums">
                          {service.durationMinutes} mins
                        </span>
                        <span className="font-serif text-xl font-semibold tabular-nums bg-[#0B3B2E]/75 backdrop-blur-sm px-3 py-0.5 rounded-md">
                          from £{service.priceFrom}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#3F6B58] mb-1">
                        {service.subtitle}
                      </p>
                      <h3 className="font-serif text-2xl font-semibold text-[#0B3B2E] mb-2">
                        {service.name}
                      </h3>
                      <p className="text-sm text-[#0B3B2E]/75 leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 border-t border-[#0B3B2E]/10 flex items-center justify-between text-xs font-medium">
                    <span className="text-[#3F6B58]">
                      {isSelected ? 'Added to appointment' : 'Tap to add'}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full transition-colors ${
                        isSelected
                          ? 'bg-[#E9C9BE]/70 text-[#0B3B2E] font-semibold'
                          : 'text-[#0B3B2E]/60 group-hover:text-[#0B3B2E]'
                      }`}
                    >
                      {isSelected ? 'Selected ✓' : '+ Add'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional Technician & Summary Row */}
          <div className="frosted-card interactive-panel rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.18em] text-[#3F6B58] font-semibold">
                    Optional Nail Artist Preference
                  </label>
                  <span className="text-xs text-[#0B3B2E]/60">
                    Default: Any available
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {TECHNICIANS.map((tech) => {
                    const active = tech.id === technicianId;
                    return (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => setTechnicianId(tech.id)}
                        className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B2E] ${
                          active
                            ? 'bg-[#0B3B2E] text-[#F6F0E9] shadow-sm'
                            : 'bg-white/75 text-[#0B3B2E] hover:bg-[#E9C9BE]/40 border border-[#0B3B2E]/15'
                        }`}
                      >
                        {tech.name}
                        {tech.id !== 'any' && (
                          <span className="opacity-70 ml-1.5 text-xs hidden sm:inline">
                            · {tech.role.split('&')[0]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-between items-stretch sm:items-center lg:items-end gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#0B3B2E]/10 lg:pl-6">
                <div className="text-left lg:text-right">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#3F6B58]">
                    Selected Treatments ({selectedServices.length})
                  </p>
                  {selectedServices.length > 0 ? (
                    <>
                      <p className="font-serif text-xl sm:text-2xl font-semibold text-[#0B3B2E]">
                        {combinedServiceNames}{' '}
                        <span className="text-[#3F6B58] font-normal tabular-nums whitespace-nowrap">
                          (from £{totalPriceFrom})
                        </span>
                      </p>
                      <p className="text-xs text-[#0B3B2E]/70 tabular-nums mt-0.5">
                        Total {totalDurationMinutes} mins · {selectedTechnician.name} ·{' '}
                        {selectedLocation.name}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-[#3F6B58] py-1">
                      Please tap at least one service card above.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={selectedServices.length === 0}
                  onClick={() => setStep(2)}
                  className="btn-luxury inline-flex items-center justify-center gap-2 bg-[#0B3B2E] disabled:bg-[#0B3B2E]/40 text-[#F6F0E9] hover:bg-[#0B3B2E]/90 px-7 py-3.5 rounded-full text-sm font-medium shadow-sm cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B3B2E]"
                >
                  <span>Continue to booking</span>
                  <span aria-hidden="true" className="text-base leading-none">
                    ↗
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT TIME */}
      {step === 2 && (
        <div className="animate-fade-slide frosted-card rounded-3xl p-6 sm:p-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#0B3B2E]/10">
            <div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-[#3F6B58] hover:text-[#0B3B2E] mb-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Edit selected treatments ({activeServicesForCalc.length})
              </button>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0B3B2E]">
                Select Date & Time
              </h3>
              <p className="text-sm text-[#0B3B2E]/75 mt-0.5 tabular-nums">
                Showing availability for{' '}
                <strong className="font-semibold text-[#0B3B2E]">
                  {combinedServiceNames} ({totalDurationMinutes} mins total)
                </strong>{' '}
                with {selectedTechnician.name} at {selectedLocation.name}
              </p>
            </div>

            {/* Salon Location Selector */}
            <div className="flex items-center gap-2 bg-white/70 p-1.5 rounded-full border border-[#0B3B2E]/10">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => onSelectLocationId(loc.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedLocation.id === loc.id
                      ? 'bg-[#0B3B2E] text-[#F6F0E9]'
                      : 'text-[#0B3B2E]/75 hover:text-[#0B3B2E]'
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* 14-Day Horizontal Date Picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-[0.18em] text-[#3F6B58] font-semibold">
                Next 14 Days
              </label>
              <span className="text-xs text-[#0B3B2E]/70 font-medium">
                {formatDisplayDate(selectedDateISO)}
              </span>
            </div>

            <div
              className="grid grid-cols-4 sm:grid-cols-7 gap-2.5"
              role="radiogroup"
              aria-label="Choose appointment date"
            >
              {next14Days.map((day) => {
                const isSelected = day.dateISO === selectedDateISO;
                return (
                  <button
                    key={day.dateISO}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedDateISO(day.dateISO)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B2E] ${
                      isSelected
                        ? 'bg-[#0B3B2E] text-[#F6F0E9] border-[#0B3B2E] shadow-sm scale-[1.02]'
                        : 'bg-white/75 hover:bg-[#E9C9BE]/35 text-[#0B3B2E] border-[#0B3B2E]/10'
                    }`}
                  >
                    <span
                      className={`block text-[10px] uppercase tracking-[0.16em] ${
                        isSelected ? 'text-[#E9C9BE]' : 'text-[#3F6B58]'
                      }`}
                    >
                      {day.isToday ? 'Today' : day.dayShort}
                    </span>
                    <span className="block font-serif text-2xl font-semibold tabular-nums my-0.5">
                      {day.dayNumber}
                    </span>
                    <span
                      className={`block text-[11px] ${
                        isSelected ? 'text-[#F6F0E9]/80' : 'text-[#0B3B2E]/60'
                      }`}
                    >
                      {day.monthShort}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots by Period */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs uppercase tracking-[0.18em] text-[#3F6B58] font-semibold">
                Available Time Windows ({totalDurationMinutes}-min block)
              </label>
              <div className="flex items-center gap-4 text-xs text-[#0B3B2E]/70 tabular-nums">
                <span>{availableSlotCount} slots open</span>
                <span>·</span>
                <span className="line-through opacity-60">Booked / Unavailable</span>
              </div>
            </div>

            {(['Morning', 'Afternoon', 'Evening'] as const).map((period) => {
              const periodSlots = timeSlots.filter((s) => s.period === period);
              if (periodSlots.length === 0) return null;

              return (
                <div key={period} className="space-y-2.5">
                  <h4 className="text-xs font-medium text-[#0B3B2E]/70">
                    {period}
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                    {periodSlots.map((slot) => {
                      const isPicked =
                        slot.available && slot.time === selectedTimeSlot;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          title={
                            !slot.available
                              ? slot.reason === 'past'
                                ? 'Past time'
                                : 'Slot unavailable for this duration'
                              : `Book ${slot.time} – ${slot.endTime}`
                          }
                          className={`py-2.5 px-3 rounded-xl text-sm tabular-nums font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B2E] ${
                            !slot.available
                              ? 'bg-[#0B3B2E]/5 text-[#0B3B2E]/30 line-through cursor-not-allowed border border-transparent'
                              : isPicked
                              ? 'bg-[#0B3B2E] text-[#F6F0E9] shadow-sm ring-2 ring-[#E9C9BE] cursor-pointer'
                              : 'bg-white/85 hover:bg-[#E9C9BE]/45 text-[#0B3B2E] border border-[#0B3B2E]/15 cursor-pointer'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step 2 Footer Action */}
          <div className="pt-4 border-t border-[#0B3B2E]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-sm text-[#0B3B2E]/80 tabular-nums">
              {selectedTimeSlot ? (
                <span>
                  Selected:{' '}
                  <strong className="text-[#0B3B2E]">
                    {formatDisplayDate(selectedDateISO)} at {selectedTimeSlot}
                  </strong>{' '}
                  ({totalDurationMinutes} mins)
                </span>
              ) : (
                <span className="text-[#3F6B58]">
                  Please choose an available time slot above to continue.
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-full text-sm font-medium text-[#0B3B2E] bg-white/75 hover:bg-white border border-[#0B3B2E]/15 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!selectedTimeSlot}
                onClick={() => setStep(3)}
                className="inline-flex items-center justify-center gap-2 bg-[#0B3B2E] disabled:bg-[#0B3B2E]/40 text-[#F6F0E9] hover:bg-[#0B3B2E]/90 px-7 py-3.5 rounded-full text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0"
              >
                <span>Continue to confirm</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRM & DETAILS */}
      {step === 3 && (
        <div className="animate-fade-slide grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Appointment Summary Card */}
          <div className="lg:col-span-5 frosted-card rounded-3xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-[#3F6B58] font-semibold">
                Appointment Summary ({activeServicesForCalc.length})
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#3F6B58] hover:text-[#0B3B2E] underline cursor-pointer"
              >
                Edit services
              </button>
            </div>

            <div className="space-y-3 pb-4 border-b border-[#0B3B2E]/10">
              {activeServicesForCalc.map((srv) => (
                <div key={srv.id} className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-[#E9C9BE]/40">
                    <ResilientImage
                      src={srv.imageUrl}
                      alt={srv.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl font-semibold text-[#0B3B2E] truncate">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-[#0B3B2E]/75 tabular-nums">
                      {srv.durationMinutes} mins · from £{srv.priceFrom}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[#0B3B2E]/65 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#3F6B58]" />
                  Date
                </dt>
                <dd className="font-medium text-[#0B3B2E] text-right tabular-nums">
                  {formatDisplayDate(selectedDateISO)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[#0B3B2E]/65 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#3F6B58]" />
                  Time & Duration
                </dt>
                <dd className="font-medium text-[#0B3B2E] text-right tabular-nums">
                  {selectedTimeSlot} ({totalDurationMinutes} mins)
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[#0B3B2E]/65 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#3F6B58]" />
                  Technician
                </dt>
                <dd className="font-medium text-[#0B3B2E] text-right">
                  {selectedTechnician.name}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[#0B3B2E]/65 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#3F6B58]" />
                  Location
                </dt>
                <dd className="font-medium text-[#0B3B2E] text-right">
                  {selectedLocation.name}
                  <span className="block text-xs text-[#0B3B2E]/65 font-normal">
                    {selectedLocation.fullAddress}
                  </span>
                </dd>
              </div>
              <div className="pt-3 border-t border-[#0B3B2E]/10 flex items-baseline justify-between gap-4">
                <dt className="text-xs uppercase tracking-[0.14em] text-[#3F6B58] font-semibold">
                  Estimated Guide Total
                </dt>
                <dd className="font-serif text-2xl font-semibold text-[#0B3B2E] tabular-nums">
                  from £{totalPriceFrom}
                </dd>
              </div>
            </dl>

            <div className="p-4 rounded-2xl bg-[#E9C9BE]/35 text-xs text-[#0B3B2E]/85 leading-relaxed">
              No upfront deposit required for this demo. Payment is settled in-salon
              after your treatment. Free rescheduling up to 24 hours prior.
            </div>
          </div>

          {/* Guest Details Form */}
          <form
            onSubmit={handleConfirmBooking}
            noValidate
            className="lg:col-span-7 frosted-card rounded-3xl p-6 sm:p-8 space-y-5"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.18em] text-[#3F6B58] font-semibold">
                Guest Information
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0B3B2E] mt-1">
                Complete your reservation
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="booking-name"
                  className="block text-xs uppercase tracking-[0.14em] text-[#0B3B2E]/80 font-medium mb-1.5"
                >
                  Full Name *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="e.g. Eleanor Vance"
                  className={`w-full px-4 py-3 rounded-xl bg-white/85 border text-sm text-[#0B3B2E] placeholder:text-[#0B3B2E]/35 focus:outline-none focus:ring-2 focus:ring-[#0B3B2E] ${
                    errors.name ? 'border-red-600' : 'border-[#0B3B2E]/15'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-700 mt-1" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="booking-phone"
                    className="block text-xs uppercase tracking-[0.14em] text-[#0B3B2E]/80 font-medium mb-1.5"
                  >
                    UK Mobile / Phone *
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    placeholder="e.g. 07700 900412"
                    className={`w-full px-4 py-3 rounded-xl bg-white/85 border text-sm text-[#0B3B2E] tabular-nums placeholder:text-[#0B3B2E]/35 focus:outline-none focus:ring-2 focus:ring-[#0B3B2E] ${
                      errors.phone ? 'border-red-600' : 'border-[#0B3B2E]/15'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-700 mt-1" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-email"
                    className="block text-xs uppercase tracking-[0.14em] text-[#0B3B2E]/80 font-medium mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    id="booking-email"
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="eleanor@example.co.uk"
                    className={`w-full px-4 py-3 rounded-xl bg-white/85 border text-sm text-[#0B3B2E] placeholder:text-[#0B3B2E]/35 focus:outline-none focus:ring-2 focus:ring-[#0B3B2E] ${
                      errors.email ? 'border-red-600' : 'border-[#0B3B2E]/15'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-700 mt-1" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-notes"
                  className="block text-xs uppercase tracking-[0.14em] text-[#0B3B2E]/80 font-medium mb-1.5"
                >
                  Preferences or Gel Removal Notes (Optional)
                </label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Let us know if you need existing gel soak-off, prefer a quiet appointment, or have a specific shade in mind..."
                  className="w-full px-4 py-3 rounded-xl bg-white/85 border border-[#0B3B2E]/15 text-sm text-[#0B3B2E] placeholder:text-[#0B3B2E]/35 focus:outline-none focus:ring-2 focus:ring-[#0B3B2E]"
                />
              </div>
            </div>

            <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-3 rounded-full text-sm font-medium text-[#0B3B2E] bg-white/75 hover:bg-white border border-[#0B3B2E]/15 transition-colors cursor-pointer"
              >
                Back to time slots
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-[#0B3B2E] text-[#F6F0E9] hover:bg-[#0B3B2E]/90 px-8 py-3.5 rounded-full text-sm font-medium transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B3B2E]"
              >
                <span>Confirm booking</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 4: CONFIRMATION SCREEN */}
      {step === 4 && confirmedBooking && (
        <div className="animate-fade-slide max-w-2xl mx-auto">
          <div className="frosted-card rounded-3xl p-7 sm:p-10 text-center space-y-7 relative overflow-hidden">
            <div
              className="w-16 h-16 rounded-full bg-[#3F6B58]/15 border border-[#3F6B58]/30 text-[#0B3B2E] flex items-center justify-center mx-auto shadow-sm"
              aria-hidden="true"
            >
              <Check className="w-8 h-8 text-[#3F6B58] stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[#3F6B58] font-medium">
                Booking Reference · {confirmedBooking.referenceCode}
              </p>
              <h3 className="font-serif text-4xl sm:text-5xl font-semibold text-[#0B3B2E]">
                Your moment{' '}
                <span className="text-[#3F6B58] italic font-normal">
                  is booked.
                </span>
              </h3>
              <p className="text-sm text-[#0B3B2E]/75 max-w-md mx-auto">
                We’ve reserved your sanctuary chair for{' '}
                <strong className="text-[#0B3B2E] font-medium">
                  {confirmedBooking.customerName}
                </strong>
                . A confirmation copy has been saved to your device.
              </p>
            </div>

            {/* Real Selected Values Rows: Date, Time, Location, Service */}
            <div className="bg-white/75 rounded-2xl p-5 sm:p-6 border border-[#0B3B2E]/10 text-left divide-y divide-[#0B3B2E]/10">
              <div className="py-3 first:pt-0 flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.16em] text-[#3F6B58]">
                  Date
                </span>
                <span className="font-medium text-sm sm:text-base text-[#0B3B2E] tabular-nums">
                  {formatDisplayDate(confirmedBooking.dateISO)}
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.16em] text-[#3F6B58]">
                  Time
                </span>
                <span className="font-medium text-sm sm:text-base text-[#0B3B2E] tabular-nums">
                  {confirmedBooking.timeSlot} ({confirmedBooking.durationMinutes} mins)
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.16em] text-[#3F6B58]">
                  Location
                </span>
                <span className="font-medium text-sm sm:text-base text-[#0B3B2E] text-right">
                  {confirmedBooking.locationName},{' '}
                  <span className="text-[#0B3B2E]/75 font-normal">
                    {confirmedBooking.locationAddress}
                  </span>
                </span>
              </div>

              <div className="py-3 last:pb-0 flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.16em] text-[#3F6B58]">
                  Service
                </span>
                <span className="font-medium text-sm sm:text-base text-[#0B3B2E] tabular-nums text-right">
                  {confirmedBooking.serviceName} · from £{confirmedBooking.priceFrom}
                  <span className="block text-xs text-[#3F6B58] font-normal">
                    Stylist: {confirmedBooking.technicianName}
                  </span>
                </span>
              </div>
            </div>

            {/* Confirmation CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B3B2E] text-[#F6F0E9] hover:bg-[#0B3B2E]/90 px-7 py-3.5 rounded-full text-sm font-medium transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>View appointment details</span>
                <span aria-hidden="true">↗</span>
              </button>

              <button
                type="button"
                onClick={() => downloadBookingICS(confirmedBooking)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E9C9BE]/60 hover:bg-[#E9C9BE] text-[#0B3B2E] px-6 py-3.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <CalendarIcon className="w-4 h-4 text-[#0B3B2E]" />
                <span>Add to calendar (.ics)</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetFlow}
                className="text-xs uppercase tracking-[0.16em] text-[#3F6B58] hover:text-[#0B3B2E] underline cursor-pointer"
              >
                Book another appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {isDetailsModalOpen && confirmedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B3B2E]/45 backdrop-blur-sm animate-fade-slide"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-appointment-title"
        >
          <div className="frosted-card bg-[#F6F0E9]/95 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#3F6B58] font-semibold">
                  Happy Nails ✦ Appointment Pass
                </p>
                <h4
                  id="modal-appointment-title"
                  className="font-serif text-3xl font-semibold text-[#0B3B2E] mt-1"
                >
                  {confirmedBooking.serviceName}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                aria-label="Close appointment details"
                className="p-2 rounded-full bg-white/80 hover:bg-white text-[#0B3B2E] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white/80 rounded-2xl p-5 space-y-3 text-sm border border-[#0B3B2E]/10">
              <div className="flex justify-between">
                <span className="text-[#0B3B2E]/65">Reference Code</span>
                <span className="font-mono font-semibold text-[#0B3B2E] tabular-nums">
                  {confirmedBooking.referenceCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0B3B2E]/65">Status</span>
                <span className="font-medium text-[#3F6B58] capitalize">
                  {confirmedBooking.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0B3B2E]/65">Date & Time</span>
                <span className="font-medium text-[#0B3B2E] tabular-nums">
                  {formatDisplayDate(confirmedBooking.dateISO)} ·{' '}
                  {confirmedBooking.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0B3B2E]/65">Duration & Guide Price</span>
                <span className="font-medium text-[#0B3B2E] tabular-nums">
                  {confirmedBooking.durationMinutes} mins · from £
                  {confirmedBooking.priceFrom}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0B3B2E]/65">Nail Artist</span>
                <span className="font-medium text-[#0B3B2E]">
                  {confirmedBooking.technicianName}
                </span>
              </div>
              <div className="pt-2 border-t border-[#0B3B2E]/10">
                <span className="block text-xs uppercase tracking-[0.14em] text-[#3F6B58] mb-1">
                  Salon Location
                </span>
                <p className="font-medium text-[#0B3B2E]">
                  {confirmedBooking.locationName}
                </p>
                <p className="text-xs text-[#0B3B2E]/75">
                  {confirmedBooking.locationAddress}
                </p>
              </div>
              <div className="pt-2 border-t border-[#0B3B2E]/10 space-y-1">
                <span className="block text-xs uppercase tracking-[0.14em] text-[#3F6B58] mb-1">
                  Guest Contact
                </span>
                <p className="text-xs text-[#0B3B2E] flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#3F6B58]" />
                  {confirmedBooking.customerName}
                </p>
                <p className="text-xs text-[#0B3B2E] flex items-center gap-2 tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-[#3F6B58]" />
                  {confirmedBooking.customerPhone}
                </p>
                <p className="text-xs text-[#0B3B2E] flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#3F6B58]" />
                  {confirmedBooking.customerEmail}
                </p>
                {confirmedBooking.notes && (
                  <p className="text-xs text-[#0B3B2E]/80 flex items-start gap-2 pt-1 italic">
                    <FileText className="w-3.5 h-3.5 text-[#3F6B58] shrink-0 mt-0.5" />
                    “{confirmedBooking.notes}”
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {onCancelBooking && confirmedBooking.status === 'confirmed' && (
                <button
                  type="button"
                  onClick={() => {
                    onCancelBooking(confirmedBooking.id);
                    setConfirmedBooking({
                      ...confirmedBooking,
                      status: 'cancelled',
                    });
                  }}
                  className="text-xs font-medium text-red-700 hover:underline cursor-pointer"
                >
                  Cancel this booking
                </button>
              )}
              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => downloadBookingICS(confirmedBooking)}
                  className="px-4 py-2.5 rounded-full text-xs font-medium bg-[#E9C9BE]/70 hover:bg-[#E9C9BE] text-[#0B3B2E] transition-colors cursor-pointer"
                >
                  Download .ics
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-medium bg-[#0B3B2E] text-[#F6F0E9] hover:bg-[#0B3B2E]/90 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
