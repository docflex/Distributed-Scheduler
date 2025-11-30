import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface JSONEditorProps {
    value: any;
    onChange: (val: any) => void;
}

export const JSONEditor = ({ value, onChange }: JSONEditorProps) => {
    const [text, setText] = useState<string>(() =>
        value ? JSON.stringify(value, null, 2) : ""
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!value) {
            setText("");
            return;
        }
        try {
            const pretty = JSON.stringify(value, null, 2);
            if (pretty !== text) setText(pretty);
        } catch {
            // ignore
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(value)]);

    const handleChange = (val: string) => {
        setText(val);
        if (!val.trim()) {
            setError(null);
            onChange(undefined);
            return;
        }
        try {
            const parsed = JSON.parse(val);
            onChange(parsed);
            setError(null);
        } catch (e: any) {
            setError(e.message || "Invalid JSON");
        }
    };

    return (
        <div className="space-y-1">
            <Label>Payload (JSON)</Label>
            <Textarea
                value={text}
                onChange={(e) => handleChange(e.target.value)}
                placeholder='e.g. { "type": "demo" }'
                className="font-mono text-xs"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
};
