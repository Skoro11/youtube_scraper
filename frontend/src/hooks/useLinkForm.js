import { useState, useCallback } from "react";

const INITIAL_FORM_STATE = {
  id: null,
  title: "",
  youtube_url: "",
  notes: "",
};

export function useLinkForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFormFromLink = useCallback((link) => {
    setFormData({
      id: link.id,
      title: link.title,
      youtube_url: link.youtube_url,
      notes: link.notes || "",
      status: link.status,
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
  }, []);

  return {
    formData,
    handleInputChange,
    setFormFromLink,
    resetForm,
  };
}
