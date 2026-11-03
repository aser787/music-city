import React, { useState } from 'react';
import { Shield, Lock, Mail, AlertTriangle, CheckCircle, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface AdminLoginViewProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess, onBackToSite }) => {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';
  const { login, setupPassword, checkEmailStatus } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailBlur = async () => {
    if (!email.trim() || !email.includes('@')) return;
    setErrorMessage('');
    setInfoMessage('');

    try {
      const status = await checkEmailStatus(email);
      if (!status.allowed) {
        setErrorMessage(
          isAr
            ? 'هذا البريد الإلكتروني غير مصرح له بالدخول إلى لوحة إدارة ميوزيك سيتي. يُرجى مراجعة إدارة المطعم.'
            : 'This email is not authorized in MUSIC_CITY_ADMIN_EMAILS. Access denied.'
        );
        setIsSetupMode(false);
      } else if (!status.hasPassword) {
        setIsSetupMode(true);
        setInfoMessage(
          isAr
            ? 'مرحباً بك! هذا البريد معتمد في قائمة الإدارة، يُرجى تعيين كلمة مرور لأول مرة لتأمين حسابك.'
            : 'Welcome! This email is authorized. Please configure your secure password for first-time access.'
        );
      } else {
        setIsSetupMode(false);
      }
    } catch (err: any) {
      console.warn('Check email error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (!email.trim() || !password) {
      setErrorMessage(isAr ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Email and password are required');
      return;
    }

    if (isSetupMode) {
      if (password.length < 6) {
        setErrorMessage(isAr ? 'كلمة المرور يجب ألا تقل عن 6 أحرف' : 'Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
        return;
      }

      setIsSubmitting(true);
      const res = await setupPassword(email, password);
      setIsSubmitting(false);

      if (res.success) {
        onSuccess();
      } else {
        setErrorMessage(res.error || (isAr ? 'فشل إعداد كلمة المرور' : 'Failed to setup password'));
      }
      return;
    }

    // Regular login
    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
    } else if (res.needsSetup) {
      setIsSetupMode(true);
      setInfoMessage(
        isAr
          ? 'يرجى تعيين كلمة المرور لهذا الحساب المعتمد أولاً.'
          : 'Please set up a password for this authorized email first.'
      );
    } else {
      setErrorMessage(
        res.error ||
          (isAr
            ? 'بيانات الدخول غير صحيحة أو غير مصرح بها'
            : 'Invalid credentials or unauthorized email')
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#211B17] text-[#FCFAF6] flex items-center justify-center px-4 py-20 relative">
      <div className="max-w-md w-full bg-[#302720] border border-[#B99A62]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Back Link */}
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#B99A62] hover:text-[#FCFAF6] transition-colors mb-6 cursor-pointer"
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isAr ? 'العودة للموقع الرئيسي' : 'Back to Website'}</span>
        </button>

        {/* Brand Icon Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#B99A62]/20 border border-[#B99A62]/40 text-[#B99A62] flex items-center justify-center mx-auto mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#FCFAF6]">
            {t('admin.portal_title')}
          </h1>
          <p className="text-xs text-[#FCFAF6]/65 font-light">
            {t('admin.portal_subtitle')}
          </p>
        </div>

        {/* Security Notice Box */}
        <div className="mb-6 p-3 rounded-xl bg-[#211B17]/80 border border-[#B99A62]/20 text-[11px] text-[#FCFAF6]/75 leading-relaxed">
          <span className="text-[#B99A62] font-semibold block mb-0.5">
            {isAr ? 'نظام التحقق المعتمد' : 'Environment Allowlist Active'}
          </span>
          <span>
            {isAr
              ? 'الدخول مقتصر على العناوين المسجلة في متغير النظام (MUSIC_CITY_ADMIN_EMAILS) مثل: asercr7777@gmail.com'
              : 'Access strictly validated against server MUSIC_CITY_ADMIN_EMAILS allowlist.'}
          </span>
        </div>

        {/* Error / Info messages */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2 animate-shake">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#FCFAF6]/90 mb-1.5">
              {t('admin.email_label')}
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-[#B99A62]" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="asercr7777@gmail.com"
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#211B17] border border-[#B99A62]/30 text-[#FCFAF6] placeholder:text-[#FCFAF6]/30 text-sm focus:border-[#B99A62] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#FCFAF6]/90 mb-1.5">
              {isSetupMode
                ? isAr
                  ? 'تعيين كلمة المرور الجديدة (6 أحرف فأكثر)'
                  : 'New Password (min 6 chars)'
                : t('admin.password_label')}
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-[#B99A62]" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#211B17] border border-[#B99A62]/30 text-[#FCFAF6] placeholder:text-[#FCFAF6]/30 text-sm focus:border-[#B99A62] outline-none"
              />
            </div>
          </div>

          {isSetupMode && (
            <div>
              <label className="block text-xs font-semibold text-[#FCFAF6]/90 mb-1.5">
                {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <KeyRound className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-[#B99A62]" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#211B17] border border-[#B99A62]/30 text-[#FCFAF6] placeholder:text-[#FCFAF6]/30 text-sm focus:border-[#B99A62] outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#B99A62] hover:bg-[#c9aa70] disabled:opacity-50 text-[#211B17] font-bold text-sm tracking-wide shadow-lg shadow-[#B99A62]/20 transition-all cursor-pointer active:scale-98 mt-2"
          >
            {isSubmitting
              ? isAr
                ? 'جارِ التحقق...'
                : 'Verifying...'
              : isSetupMode
              ? t('admin.setup_btn')
              : t('admin.login_btn')}
          </button>
        </form>
      </div>
    </div>
  );
};
