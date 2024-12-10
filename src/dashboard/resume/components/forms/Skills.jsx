import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from './../../../../../service/GlobalApi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

function Skills() {
  const [skillsList, setSkillsList] = useState([]);
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  // Load skills from context into local state
  useEffect(() => {
    if (Array.isArray(resumeInfo?.skills)) {
      setSkillsList(resumeInfo.skills);
    }
  }, [resumeInfo]);

  // Update the context whenever skillsList changes
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      skills: skillsList,
    }));
  }, [skillsList, setResumeInfo]);

  // Handle skill field updates
  const handleChange = (index, field, value) => {
    setSkillsList((prev) =>
      prev.map((skill, idx) => (idx === index ? { ...skill, [field]: value } : skill))
    );
  };

  // Add a new skill
  const addSkill = () => {
    setSkillsList((prev) => [...prev, { name: '', rating: 0 }]);
  };

  // Remove the last skill
  const removeSkill = () => {
    setSkillsList((prev) => prev.slice(0, -1));
  };

  // Validate skills before saving
  const validateSkills = () => {
    if (!skillsList.length) {
      toast('Please add at least one skill before saving.');
      return false;
    }
    const isValid = skillsList.every(
      (skill) => skill.name.trim() && skill.rating > 0
    );
    if (!isValid) {
      toast('Ensure all skills have a name and a valid rating.');
      return false;
    }
    return true;
  };

  // Save skills to the backend
  const saveSkills = async () => {
    if (!validateSkills()) return;

    setLoading(true);

    const payload = {
      data: {
        skills: skillsList.map(({ id, ...rest }) => rest),
      },
    };

    try {
      const response = await GlobalApi.UpdateResumeDetail(resumeId, payload);
      console.log('API Response:', response); // Debugging response
      toast('Skills updated successfully!');
    } catch (error) {
      console.error('Save Error:', error.response?.data || error.message);
      toast('Server error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your top professional skills.</p>

      <div>
        {skillsList.map((skill, index) => (
          <div key={index} className="flex justify-between mb-2 border rounded-lg p-3">
            <div>
              <label className="text-xs">Skill Name</label>
              <Input
                className="w-full"
                value={skill.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs">Rating</label>
              <Rating
                style={{ maxWidth: 120 }}
                value={skill.rating}
                onChange={(value) => handleChange(index, 'rating', value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={addSkill} className="text-primary">
            + Add Skill
          </Button>
          <Button
            variant="outline"
            onClick={removeSkill}
            disabled={!skillsList.length}
            className="text-primary"
          >
            - Remove Skill
          </Button>
        </div>
        <Button onClick={saveSkills} disabled={loading}>
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default Skills;
