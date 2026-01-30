"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/lib/hooks/use-clients";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import { User, Buildings, Phone, Globe, Briefcase, UsersThree, CheckCircle } from "@phosphor-icons/react";

export default function ProfileSettingsPage() {
  const { profile, updateProfile } = useProfile();
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name || "");
    setCompanyName(profile.company_name || "");
    setPhone(profile.phone || "");
    setWebsite(profile.website || "");
    setIndustry(profile.industry || "");
    setRole(profile.role || "");
    setCompanySize(profile.company_size || "");
  }, [profile]);

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
      {/* Profile Header Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <UserAvatar name={fullName} size={64} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{fullName || "Your Name"}</h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            {companyName && <p className="text-sm text-blue-600">{companyName}</p>}
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
          <span className="text-sm text-green-600 flex items-center gap-1">
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
