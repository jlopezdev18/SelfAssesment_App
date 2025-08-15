import React, { useState } from "react";
import { Image, X } from "lucide-react";
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
      <h2>Latest Update – Release December 2023</h2>
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
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Release Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter post title"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullContent">Full Content</Label>
              <TipTapRichTextEditor
                value={form.fullContent}
                onChange={(html) => handleChange("fullContent", html)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  type="text"
                  placeholder="e.g., v1.2.0"
                  value={form.version}
                  onChange={(e) => handleChange("version", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  type="text"
                  placeholder="comma, separated, tags"
                  value={form.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <Card className="border-dashed border-2">
                <CardContent className="p-6">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-full object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={removeImage}
                        className="absolute top-2 right-2 h-6 w-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div>
                        <label className="cursor-pointer">
                          <span className="text-sm font-medium text-primary hover:text-primary/80">
                            Upload a file
                          </span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="text-sm text-muted-foreground">
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Post</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReleasePostModal;
