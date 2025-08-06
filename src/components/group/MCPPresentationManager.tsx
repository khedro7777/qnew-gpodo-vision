
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  FileText, 
  Edit, 
  Save, 
  Eye, 
  RefreshCw,
  Calendar,
  Users,
  Building2,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

interface MCPPresentationManagerProps {
  groupId: string;
  group: any;
}

interface GroupPresentation {
  id: string;
  group_id: string;
  presentation_type: 'loi' | 'terms_conditions';
  title: string;
  content: string;
  status: 'draft' | 'active' | 'under_review';
  generated_by_mcp: boolean;
  last_updated_by: string;
  version: number;
  created_at: string;
  updated_at: string;
}

const MCPPresentationManager = ({ groupId, group }: MCPPresentationManagerProps) => {
  const { user } = useAuth();
  const { t, isRTL } = useTranslation();
  const [presentations, setPresentations] = useState<GroupPresentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [generatingLOI, setGeneratingLOI] = useState(false);
  const [generatingTC, setGeneratingTC] = useState(false);

  useEffect(() => {
    loadPresentations();
  }, [groupId]);

  const loadPresentations = async () => {
    try {
      // Mock data for demo - in real app this would come from database
      const mockPresentations: GroupPresentation[] = [
        {
          id: '1',
          group_id: groupId,
          presentation_type: 'loi',
          title: 'Letter of Intent - Group Purchasing',
          content: `Letter of Intent for ${group?.name || 'Group'}

Date: ${new Date().toLocaleDateString()}

This Letter of Intent outlines the preliminary agreement between the members of ${group?.name || 'this group'} for collective purchasing activities.

Purpose:
The group aims to leverage collective buying power to negotiate better prices, terms, and conditions with suppliers in the ${group?.industry_sectors?.name || 'industry'} sector.

Objectives:
1. Achieve cost savings through bulk purchasing
2. Establish long-term supplier relationships
3. Maintain quality standards across all purchases
4. Ensure fair distribution of benefits among members

Member Commitments:
- Participate actively in group decisions
- Honor collective agreements
- Share relevant market information
- Maintain confidentiality of group strategies

This LOI serves as a foundation for formal agreements and demonstrates our collective commitment to successful group purchasing initiatives.`,
          status: 'active',
          generated_by_mcp: true,
          last_updated_by: 'MCP Assistant',
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          group_id: groupId,
          presentation_type: 'terms_conditions',
          title: 'Terms and Conditions',
          content: `Terms and Conditions for ${group?.name || 'Group'}

Last Updated: ${new Date().toLocaleDateString()}

1. MEMBERSHIP
- Members must be verified and in good standing
- Maximum ${group?.max_members || 50} members allowed
- Membership can be revoked for violations

2. OBLIGATIONS
- Active participation in group activities
- Timely payment of agreed amounts
- Compliance with group decisions
- Respect for other members

3. PURCHASING TERMS
- All purchases subject to group approval
- Payment terms as agreed collectively
- Quality standards must be maintained
- Disputes resolved through group process

4. CONFIDENTIALITY
- Group strategies remain confidential
- Member information protected
- Supplier negotiations private
- No sharing of competitive information

5. TERMINATION
- Members may leave with 30-day notice
- Outstanding obligations must be settled
- Group may dissolve by majority vote

6. GOVERNANCE
- Decisions by majority vote
- Manager elected by members
- MCP Assistant facilitates processes
- Regular meetings required

These terms ensure fair and effective group operations while protecting all members' interests.`,
          status: 'active',
          generated_by_mcp: true,
          last_updated_by: 'MCP Assistant',
          version: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setPresentations(mockPresentations);
    } catch (error) {
      console.error('Error loading presentations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePresentation = async (type: 'loi' | 'terms_conditions') => {
    const isLOI = type === 'loi';
    const setGenerating = isLOI ? setGeneratingLOI : setGeneratingTC;
    
    setGenerating(true);
    try {
      // Simulate MCP Assistant generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPresentation: GroupPresentation = {
        id: Date.now().toString(),
        group_id: groupId,
        presentation_type: type,
        title: isLOI ? 'Letter of Intent - Generated by MCP' : 'Terms and Conditions - Generated by MCP',
        content: isLOI ? generateLOIContent() : generateTCContent(),
        status: 'draft',
        generated_by_mcp: true,
        last_updated_by: 'MCP Assistant',
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setPresentations(prev => [newPresentation, ...prev.filter(p => p.presentation_type !== type)]);
      toast.success(t(`${isLOI ? 'Letter of Intent' : 'Terms and Conditions'} generated successfully by MCP Assistant`));
    } catch (error) {
      console.error('Error generating presentation:', error);
      toast.error(t('Failed to generate presentation'));
    } finally {
      setGenerating(false);
    }
  };

  const generateLOIContent = () => {
    return `Letter of Intent - ${group?.name || 'Group'}

Generated by MCP Assistant on ${new Date().toLocaleDateString()}

PARTIES INVOLVED
${group?.name || 'Group'} members from ${group?.countries?.name || 'Various countries'}
Industry: ${group?.industry_sectors?.name || 'General'}
Current Members: ${group?.current_members || 'N/A'}/${group?.max_members || 'N/A'}

PURPOSE AND INTENT
This Letter of Intent establishes the framework for collaborative business activities among group members, leveraging collective strength for mutual benefit.

KEY OBJECTIVES
✓ Maximize cost efficiency through group purchasing
✓ Establish preferred supplier relationships
✓ Share market intelligence and insights
✓ Maintain competitive advantages collectively
✓ Ensure quality standards across all activities

MEMBER BENEFITS
- Reduced procurement costs
- Access to premium suppliers
- Shared negotiation power
- Risk mitigation through diversification
- Knowledge sharing opportunities

NEXT STEPS
1. Member review and feedback period (7 days)
2. Formal agreement drafting
3. Implementation planning
4. Supplier engagement strategy

This LOI demonstrates our collective commitment to successful collaboration.

Generated with AI assistance for accuracy and completeness.`;
  };

  const generateTCContent = () => {
    return `Terms and Conditions - ${group?.name || 'Group'}

Generated by MCP Assistant on ${new Date().toLocaleDateString()}

SECTION 1: DEFINITIONS AND SCOPE
"Group" refers to ${group?.name || 'this organization'}
"Members" refers to verified participants
"Platform" refers to the MCP collaboration system
"Activities" refers to all group-related business operations

SECTION 2: MEMBERSHIP REQUIREMENTS
✓ Completed KYC verification
✓ Industry relevance to ${group?.industry_sectors?.name || 'group focus'}
✓ Good standing in business community
✓ Commitment to group objectives

SECTION 3: RIGHTS AND OBLIGATIONS
Member Rights:
- Equal voting power in decisions
- Access to group benefits and resources
- Transparent information sharing
- Fair treatment in all dealings

Member Obligations:
- Active participation in group activities
- Timely fulfillment of commitments
- Confidentiality of sensitive information
- Compliance with group decisions

SECTION 4: OPERATIONAL PROCEDURES
Decision Making: Majority vote required
Communication: Through official channels only
Meetings: Regular schedule with advance notice
Documentation: All agreements properly recorded

SECTION 5: FINANCIAL TERMS
- Cost sharing based on benefit received
- Payment terms as agreed per transaction
- Dispute resolution through mediation
- Audit rights for financial transparency

SECTION 6: TERMINATION CONDITIONS
- Voluntary withdrawal with 30-day notice
- Involuntary removal for violations
- Settlement of outstanding obligations
- Return of confidential materials

SECTION 7: DISPUTE RESOLUTION
1. Direct negotiation between parties
2. Mediation through neutral third party
3. Arbitration if mediation fails
4. Legal action as last resort

These terms ensure fair, transparent, and effective group operations.

MCP Assistant ensures compliance and updates as needed.`;
  };

  const startEditing = (presentation: GroupPresentation) => {
    setEditingId(presentation.id);
    setEditContent(presentation.content);
  };

  const saveEdit = async (presentationId: string) => {
    try {
      setPresentations(prev => prev.map(p => 
        p.id === presentationId 
          ? {
              ...p,
              content: editContent,
              updated_at: new Date().toISOString(),
              last_updated_by: user?.full_name || 'Member',
              version: p.version + 1,
              status: 'under_review' as const
            }
          : p
      ));
      
      setEditingId(null);
      setEditContent('');
      toast.success(t('Presentation updated successfully'));
    } catch (error) {
      console.error('Error saving presentation:', error);
      toast.error(t('Failed to save presentation'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
          <p>{t('Loading presentations...')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* MCP Assistant Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t('MCP Assistant')}</h3>
              <p className="text-white/80">{t('Automated Presentation Management')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => generatePresentation('loi')}
              disabled={generatingLOI}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {generatingLOI ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              {t('Generate LOI')}
            </Button>
            <Button 
              onClick={() => generatePresentation('terms_conditions')}
              disabled={generatingTC}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {generatingTC ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              {t('Generate Terms & Conditions')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Presentations List */}
      <div className="space-y-4">
        {presentations.map((presentation) => (
          <Card key={presentation.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {presentation.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(presentation.status)}>
                      {t(presentation.status)}
                    </Badge>
                    {presentation.generated_by_mcp && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Bot className="w-3 h-3 mr-1" />
                        {t('MCP Generated')}
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">
                      {t('Version')} {presentation.version}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editingId === presentation.id ? (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => saveEdit(presentation.id)}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        {t('Save')}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setEditContent('');
                        }}
                      >
                        {t('Cancel')}
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => startEditing(presentation)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      {t('Edit')}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === presentation.id ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder={t('Edit presentation content...')}
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                    {presentation.content}
                  </pre>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                <div>
                  {t('Last updated by')}: {presentation.last_updated_by}
                </div>
                <div>
                  {new Date(presentation.updated_at).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {presentations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('No presentations yet')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('Use MCP Assistant to generate Letter of Intent and Terms & Conditions for your group')}
            </p>
            <div className="flex justify-center gap-2">
              <Button onClick={() => generatePresentation('loi')}>
                {t('Generate LOI')}
              </Button>
              <Button onClick={() => generatePresentation('terms_conditions')} variant="outline">
                {t('Generate Terms & Conditions')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MCPPresentationManager;
