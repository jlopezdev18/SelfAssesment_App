import React, { useState } from "react";
import { Image, X, Upload, FileText, Tag, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { ReleasePost } from "./types/DashboardMainInterfaces";
import TipTapRichTextEditor from "./TipTapRichTextEditor";

interface AddReleasePostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (post: ReleasePost) => void;
}

const AddReleasePostModal: React.FC<AddReleasePostModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    title: "Latest Update - Release December 2023",
    fullContent: `
      <p>Hello Users,</p>
      <p>We hope this message finds you well! We're thrilled to share some exciting news with you – a brand new version of our application is now available for download!</p>
      <p>Our team has been working hard to enhance your user experience, address any bugs, and introduce exciting new features. To take advantage of these improvements, we encourage you to upgrade to the latest version.</p>
      <br/>
      <h3>How to get started</h3>
      <ol>
        <li>Update to the latest version from your app store.</li>
        <li>
          Review the version history in our
          <a href="https://selfassesmentapp.netlify.app/dashboard/versioning" target="_blank" rel="noopener noreferrer"> Dashboard › Versioning</a>.
        </li>
        <li>Visit the download page.</li>
      </ol>
      <br/>
      <p>We sincerely appreciate your continued support, and we're confident that you'll love the enhancements we've made.</p>
      <p>If you have any questions or encounter any issues during the update process, please don't hesitate to reach out.</p>
      <p>Thank you for being a valued member of our community!</p>
      <p>Best regards,<br/>The Development Team</p>
    `,
    version: "v1.2.0",
    tags: "Update, Download, Features, Bug Fixes",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setForm((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setForm((prev) => ({ ...prev, image: "" }));
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = form.tags.split(",").map((tag) => tag.trim());

    onSubmit({
      ...form,
      tags: tagsArray,
      id: "",
      date: {
        _seconds: Math.floor(Date.now() / 1000),
        _nanoseconds: 0,
      },
      image: form.image || "",
    });

    // Show success toast
    toast.success("Post created successfully! 🎉", {
      description: "Your release post has been published to the dashboard.",
      duration: 4000,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Create Release Post
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Share updates and announcements with your users
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-2">
            {/* Title Section */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-semibold flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Post Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter an engaging title for your release"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                className="h-11"
              />
            </div>

            {/* Content Section */}
            <div className="space-y-2">
              <Label htmlFor="fullContent" className="text-sm font-semibold">
                Content
              </Label>
              <div className="border rounded-lg overflow-hidden">
                <TipTapRichTextEditor
                  value={form.fullContent}
                  onChange={(html) => handleChange("fullContent", html)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Use rich formatting to make your content engaging
              </p>
            </div>

            {/* Version and Tags Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="version"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Version
                </Label>
                <Input
                  id="version"
                  type="text"
                  placeholder="e.g., v1.2.0"
                  value={form.version}
                  onChange={(e) => handleChange("version", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="tags"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  Tags
                </Label>
                <Input
                  id="tags"
                  type="text"
                  placeholder="Update, Features, Bug Fixes"
                  value={form.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Image className="w-4 h-4" />
                Cover Image
              </Label>
              <Card className="border-dashed border-2 hover:border-blue-300 transition-colors">
                <CardContent className="p-6">
                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-40 w-full object-cover rounded-lg shadow-sm"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                          className="shadow-lg"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                        <Upload className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <label className="cursor-pointer">
                          <span className="text-base font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            Choose an image
                          </span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          or drag and drop
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="min-w-20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="min-w-24 bg-blue-600 hover:bg-blue-700"
            >
              Create Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReleasePostModal;
