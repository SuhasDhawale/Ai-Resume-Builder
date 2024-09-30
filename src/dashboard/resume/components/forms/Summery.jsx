import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession } from './../../../../../service/AIModal';

const prompt = "Job Title: {jobTitle}, Depending on the job title give me a list of summaries for 3 experience levels: Senior, Mid Level, and Fresher level, in 3-4 lines in array format. Include 'summary' and 'experience_level' fields in JSON format.";

function Summery({ enabledNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [summery, setSummery] = useState('');
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);

    useEffect(() => {
        if (summery) {
            setResumeInfo({
                ...resumeInfo,
                summery: summery
            });
        }
    }, [summery]);

    const GenerateSummeryFromAI = async () => {
        try {
            setLoading(true);
            const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle || '');
            console.log("Sending prompt to AI:", PROMPT);

            const result = await AIChatSession.sendMessage(PROMPT);
            const responseText = await result.response.text();
            console.log("AI Response:", responseText);

            // Sanitize the AI response by removing backticks
            const sanitizedResponseText = responseText.replace(/```json|```/g, '').trim();

            // Try to parse the sanitized response
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(sanitizedResponseText);
                console.log("Parsed AI Response:", parsedResponse);
            } catch (jsonError) {
                console.error("Failed to parse AI response as JSON:", jsonError);
                toast.error('The AI response is not in a valid JSON format. Please try again.');
                return;
            }

            // Set the AI generated summaries
            setAiGenerateSummeryList(parsedResponse);
        } catch (error) {
            console.error('Error generating summary:', error);
            toast.error('Failed to generate summary from AI.');
        } finally {
            setLoading(false);
        }
    };

    const onSave = (e) => {
        e.preventDefault();

        setLoading(true);
        const data = {
            data: {
                summery: summery
            }
        };
        GlobalApi.UpdateResumeDetail(params?.resumeId, data).then(resp => {
            console.log(resp);
            enabledNext(true);
            setLoading(false);
            toast.success("Details updated");
        }).catch(error => {
            console.error("Failed to update resume details:", error);
            setLoading(false);
            toast.error("Failed to update details. Please try again.");
        });
    };

    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Summery</h2>
                <p>Add Summery for your job title</p>

                <form className='mt-7' onSubmit={onSave}>
                    <div className='flex justify-between items-end'>
                        <label>Add Summery</label>
                        <Button variant="outline" onClick={GenerateSummeryFromAI}
                                type="button" size="sm" className="border-primary text-primary flex gap-2">
                            <Brain className='h-4 w-4' /> Generate from AI
                        </Button>
                    </div>
                    <Textarea className="mt-5" required
                              value={summery}
                              defaultValue={summery || resumeInfo?.summery}
                              onChange={(e) => setSummery(e.target.value)}
                    />
                    <div className='mt-2 flex justify-end'>
                        <Button type="submit" disabled={loading}>
                            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>

            {aiGeneratedSummeryList && aiGeneratedSummeryList.length > 0 && (
                <div className='my-5'>
                    <h2 className='font-bold text-lg'>Suggestions</h2>
                    {aiGeneratedSummeryList.map((item, index) => (
                        <div key={index}
                             onClick={() => setSummery(item?.summary)}
                             className='p-5 shadow-lg my-4 rounded-lg cursor-pointer'>
                            <h2 className='font-bold my-1 text-primary'>Level: {item?.experience_level}</h2>
                            <p>{item?.summary}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Summery;
