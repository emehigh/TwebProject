import React, { memo, useState, Fragment } from "react";
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { Seo } from "@presentation/components/ui/Seo";

type FeedbackFormPageProps = {
    username: string;
};

export const FeedbackPage = memo(({ username }: FeedbackFormPageProps) => {
    const [satisfaction, setSatisfaction] = useState("good");
    const [recommend, setRecommend] = useState("yes");
    const [improvements, setImprovements] = useState<string[]>([]);
    const [comments, setComments] = useState("");
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            username,
            satisfaction,
            recommend,
            improvements,
            comments,
        };

        fetch(`http://localhost:8090/api/v1/feedback/${username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error submitting feedback");
                return res.json();
            })
            .then(() => {
                setSuccess("Feedback trimis cu succes!");
                setError(null);
            })
            .catch((err) => {
                console.error(err);
                setError("A apărut o eroare la trimiterea feedbackului.");
                setSuccess(null);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCheckboxChange = (value: string) => {
        setImprovements((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    return (
        <Fragment>
            <Seo title={`MobyLab Web App | Feedback`} />
            <Box sx={{ padding: "20px 50px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <Typography variant="h4" sx={{ textAlign: "center", marginBottom: "20px" }}>
                    Formular feedback
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Select */}
                    <Box>
                        <Typography variant="subtitle1">Cum apreciezi experiența ta generală?</Typography>
                        <TextField
                            select
                            fullWidth
                            value={satisfaction}
                            onChange={(e) => setSatisfaction(e.target.value)}
                            SelectProps={{ native: true }}
                        >
                            <option value="excellent">Excelent</option>
                            <option value="good">Bună</option>
                            <option value="average">Mediocră</option>
                            <option value="poor">Slabă</option>
                        </TextField>
                    </Box>

                    {/* Radio */}
                    <Box>
                        <Typography variant="subtitle1">Ai recomanda aplicația altora?</Typography>
                        <RadioGroup
                            value={recommend}
                            onChange={(e) => setRecommend(e.target.value)}
                            row
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Da" />
                            <FormControlLabel value="no" control={<Radio />} label="Nu" />
                        </RadioGroup>
                    </Box>

                    {/* Checkbox */}
                    <Box>
                        <Typography variant="subtitle1">Ce îmbunătățiri ți-ai dori?</Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={improvements.includes("UI")}
                                    onChange={() => handleCheckboxChange("UI")}
                                />
                            }
                            label="Interfață mai modernă"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={improvements.includes("speed")}
                                    onChange={() => handleCheckboxChange("speed")}
                                />
                            }
                            label="Performanță mai bună"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={improvements.includes("features")}
                                    onChange={() => handleCheckboxChange("features")}
                                />
                            }
                            label="Mai multe funcționalități"
                        />
                    </Box>

                    {/* Textarea */}
                    <Box>
                        <Typography variant="subtitle1">Alte comentarii:</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Scrie părerea ta aici..."
                        />
                    </Box>

                    {/* Submit Button */}
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : "Trimite feedback"}
                    </Button>
                </Box>

                {/* Success/Error Messages */}
                {success && <Typography color="success.main" sx={{ textAlign: "center" }}>{success}</Typography>}
                {error && <Typography color="error.main" sx={{ textAlign: "center" }}>{error}</Typography>}
            </Box>
        </Fragment>
    );
});