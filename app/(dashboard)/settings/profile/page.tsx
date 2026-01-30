"use client";

import { useEffect, useState, useRef } from "react";
import { useProfile } from "@/lib/hooks/use-clients";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import { User, Buildings, Phone, Globe, Briefcase, UsersThree, CheckCircle, Camera, Trash } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
  const { profile, updateProfile } = useProfile();
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name || "");
    setCompanyName(profile.company_name || "");
    setPhone(profile.phone || "");
    setWebsite(profile.website || "");
    setIndustry(profile.industry || "");
    setRole(profile.role || "");
    setCompanySize(profile.company_size || "");
    setAvatarUrl(profile.avatar_url || null);
  }, [profile]);

  const handleAvatarUpload = async (file: File) => {
    if (!profile?.id) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const supabase = createSupabaseBrowserClient();
      
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        // If bucket doesn't exist, show helpful message
        if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
          toast.error('Avatar storage not configured. Please run the migration.');
          return;
        }
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      await updateProfile({ avatar_url: publicUrl });
      setAvatarUrl(publicUrl);
      toast.success('Profile picture updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    try {
      await updateProfile({ avatar_url: null });
      setAvatarUrl(null);
      toast.success('Profile picture removed');
    } catch (error: any) {
      toast.error('Failed to remove picture');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    await updateProfile({
      full_name: fullName,
      company_name: companyName,
      phone,
      website,
      industry,
      role,
      company_size: companySize,
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card with Avatar Upload */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar with upload */}
          <div className="relative group">
            <UserAvatar name={fullName} avatarUrl={avatarUrl} size={96} />
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                disabled={uploadingAvatar}
                title="Upload photo"
              >
                <Camera className="h-5 w-5 text-white" weight="fill" />
              </button>
              {avatarUrl && (
                <button
                  onClick={handleRemoveAvatar}
                  className="p-2 rounded-full bg-white/20 hover:bg-red-500/50 transition-colors"
                  disabled={uploadingAvatar}
                  title="Remove photo"
                >
                  <Trash className="h-5 w-5 text-white" weight="fill" />
                </button>
              )}
            </div>
            {uploadingAvatar && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarUpload(file);
                e.target.value = '';
              }}
            />
          </div>
          
          {/* Info */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-gray-900">{fullName || "Your Name"}</h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            {companyName && <p className="text-sm text-blue-600 mt-1">{companyName}</p>}
            <p className="text-xs text-gray-400 mt-2">
              Click on your avatar to upload a new photo
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" weight="fill" />
            Personal Information
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-gray-400" weight="regular" />
              Full Name
            </label>
            <Input 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="John Doe"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-gray-400" weight="regular" />
              Phone
            </label>
            <Input 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="+1 (555) 123-4567"
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Buildings className="h-4 w-4 text-blue-600" weight="fill" />
            Business Information
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Buildings className="h-3.5 w-3.5 text-gray-400" weight="regular" />
              Company / Business
            </label>
            <Input 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)} 
              placeholder="Acme Inc."
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-gray-400" weight="regular" />
              Website
            </label>
            <Input 
              value={website} 
              onChange={(e) => setWebsite(e.target.value)} 
              placeholder="https://example.com"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-gray-400" weight="regular" />
              Industry
            </label>
            <Select value={industry || undefined} onValueChange={setIndustry}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Consulting">Consulting</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-gray-400" weight="regular" />
              Role / Position
            </label>
            <Select value={role || undefined} onValueChange={setRole}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="CEO">CEO</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Sales Rep">Sales Rep</SelectItem>
                <SelectItem value="Freelancer">Freelancer</SelectItem>
                <SelectItem value="Consultant">Consultant</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <UsersThree className="h-3.5 w-3.5 text-gray-400" weight="regular" />
              Team Size
            </label>
            <Select value={companySize || undefined} onValueChange={setCompanySize}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Just me">Just me</SelectItem>
                <SelectItem value="2-10">2-10 people</SelectItem>
                <SelectItem value="11-50">11-50 people</SelectItem>
                <SelectItem value="51-200">51-200 people</SelectItem>
                <SelectItem value="200+">200+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <span className="text-sm text-emerald-600 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" weight="fill" />
            Changes saved
          </span>
        )}
        <Button onClick={handleSave} disabled={loading} className="px-6">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
