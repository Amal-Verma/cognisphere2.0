"use client";

import { useState, useEffect } from "react";
import { Nunito } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Circle, Play, ArrowDown, ArrowRight, ArrowLeft, BookOpen, ClipboardCheck, Sparkles } from "lucide-react";
import type { RoadmapNode } from "../../utlis/generate/type";

const nunito = Nunito({ subsets: ["latin"] });

// Default roadmap data - empty by default
const defaultRoadmap: RoadmapNode[] = [];

// Connector component
const Connector = ({ 
  direction, 
  isActive 
}: { 
  direction: 'down' | 'right' | 'left'; 
  isActive: boolean;
}) => {
  const getConnectorStyle = () => {
    if (isActive) {
      return 'text-blue-600 drop-shadow-lg';
    }
    return 'text-gray-500';
  };

  const getConnectorIcon = () => {
    switch (direction) {
      case 'down':
        return <ArrowDown className={`w-8 h-8 ${getConnectorStyle()} animate-pulse`} />;
      case 'right':
        return <ArrowRight className={`w-8 h-8 ${getConnectorStyle()}`} />;
      case 'left':
        return <ArrowLeft className={`w-8 h-8 ${getConnectorStyle()}`} />;
    }
  };

  const getConnectorContainer = () => {
    if (direction === 'down') {
      return "flex items-center justify-center py-6";
    }
    return "flex items-center justify-center px-4 h-full";
  };

  return (
    <div className={getConnectorContainer()}>
      <div className={`${isActive ? 'opacity-100 scale-110' : 'opacity-70'} transition-all duration-300 bg-white rounded-full p-2 shadow-lg border-2 ${isActive ? 'border-blue-200' : 'border-gray-200'}`}>
        {getConnectorIcon()}
      </div>
    </div>
  );
};

const RoadmapNode = ({ 
  node, 
  status, 
  index
}: { 
  node: RoadmapNode; 
  status: 'completed' | 'current' | 'pending';
  index: number;
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'current':
        return <Play className="w-6 h-6 text-blue-500" />;
      case 'pending':
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'current':
        return 'from-blue-500 to-purple-500';
      case 'pending':
        return 'from-gray-300 to-gray-400';
    }
  };

  const getCardStyle = () => {
    const baseStyle = node.type === 'test' ? 'border-l-4 border-l-orange-400' : 'border-l-4 border-l-blue-400';
    switch (status) {
      case 'completed':
        return `bg-green-50/80 border-green-200 shadow-green-100 ${baseStyle}`;
      case 'current':
        return `bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-blue-100 ring-2 ring-blue-200 ring-opacity-50 ${baseStyle}`;
      case 'pending':
        return `bg-gray-50/60 border-gray-200 shadow-gray-100 ${baseStyle}`;
    }
  };

  const getTypeIcon = () => {
    if (node.type === 'test') {
      return <ClipboardCheck className="w-4 h-4 text-orange-500" />;
    }
    return <BookOpen className="w-4 h-4 text-blue-500" />;
  };

  const getTypeLabel = () => {
    return node.type === 'test' ? 'Assessment' : 'Course';
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <Card className={`w-full max-w-sm ${getCardStyle()} hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative`}>
        {/* Node Number - Top Left Corner */}
        <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-r ${getStatusColor()} flex items-center justify-center text-white font-bold text-sm shadow-lg z-10`}>
          {index + 1}
        </div>
        
        {/* Type Badge - Top Right Corner */}
        <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium shadow-lg z-10 ${
          node.type === 'test' 
            ? 'bg-orange-100 text-orange-700 border border-orange-200' 
            : 'bg-blue-100 text-blue-700 border border-blue-200'
        }`}>
          <div className="flex items-center gap-1">
            {getTypeIcon()}
            {getTypeLabel()}
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-base font-bold mb-2 ${
                status === 'pending' ? 'text-gray-600' : 'text-gray-800'
              }`}>
                {node.title}
              </h3>
              <p className={`text-xs leading-relaxed ${
                status === 'pending' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {node.description}
              </p>
              
              {/* Status Badge */}
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : status === 'current'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {status === 'completed' && <CheckCircle className="w-3 h-3" />}
                  {status === 'current' && <Clock className="w-3 h-3 animate-pulse" />}
                  {status === 'pending' && <Circle className="w-3 h-3" />}
                  {status === 'completed' ? 'Completed' : status === 'current' ? 'In Progress' : 'Pending'}
                </span>
              </div>

              {/* Action Button for Current Node - Generate Course */}
              {status === 'current' && node.type === 'course' && (
                <Button 
                  onClick={() => {
                    // Store course data in localStorage for crash course component
                    localStorage.setItem('courseTitle', node.title);
                    localStorage.setItem('courseDescription', node.description);
                    // Redirect to crash course page
                    window.location.href = '/crashcourse';
                  }}
                  className="mt-3 w-full shadow-lg text-xs bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  size="sm"
                >
                  Start Learning
                </Button>
              )}
              {status === 'current' && node.type === 'test' && (
                <Button 
                  onClick={() => {
                    // Redirect to test/assessment page
                    window.location.href = `/test`;
                  }}
                  className="mt-3 w-full shadow-lg text-xs bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  size="sm"
                >
                  Take Assessment
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function RoadmapPage({ n = 3 }: { n?: number }) {
  const [roadmapData, setRoadmapData] = useState<RoadmapNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [generatedAt, setGeneratedAt] = useState<string>("");
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number>(1);

  useEffect(() => {
    // Load roadmap and prompt from localStorage or use default
    try {
      const savedRoadmap = localStorage.getItem("generatedRoadmap");
      const savedPrompt = localStorage.getItem("roadmapPrompt");
      const savedTimestamp = localStorage.getItem("roadmapGeneratedAt");
      const savedCurrentIndex = localStorage.getItem("roadmapCurrentIndex");
      
      if (savedRoadmap) {
        const parsedRoadmap: RoadmapNode[] = JSON.parse(savedRoadmap);
        setRoadmapData(parsedRoadmap);
      } else {
        setRoadmapData(defaultRoadmap);
      }
      
      if (savedPrompt) {
        setUserPrompt(savedPrompt);
      }
      
      if (savedTimestamp) {
        setGeneratedAt(savedTimestamp);
      }
      
      if (savedCurrentIndex) {
        setCurrentNodeIndex(parseInt(savedCurrentIndex, 10));
      }
    } catch (error) {
      console.error("Error loading roadmap from localStorage:", error);
      setRoadmapData(defaultRoadmap);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className={`${nunito.className} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your roadmap...</p>
        </div>
      </div>
    );
  }
  const getNodeStatus = (index: number): 'completed' | 'current' | 'pending' => {
    if (index < currentNodeIndex) return 'completed';
    if (index === currentNodeIndex) return 'current';
    return 'pending';
  };

  // Simple S-shaped grid layout - Your brilliant approach!
  const createSimpleGridLayout = () => {
    const rows = [];
    let currentIndex = 0;
    let rowIndex = 0;
    
    while (currentIndex < roadmapData.length) {
      const isReversed = rowIndex % 2 === 1;
      
      // Create node row with width 2*n - 1 (nodes + horizontal connectors)
      const nodeRow = [];
      const nodesInThisRow = [];
      
      // Fill nodes for this row
      for (let i = 0; i < n && currentIndex < roadmapData.length; i++) {
        nodesInThisRow.push(currentIndex);
        currentIndex++;
      }
      
      // Build the row: node, connector, node, connector, node...
      for (let i = 0; i < n; i++) {
        // For reversed rows, we need to place nodes in reverse order
        const nodeIndexInRow = isReversed ? (n - 1 - i) : i;
        
        if (nodeIndexInRow < nodesInThisRow.length) {
          nodeRow.push({ type: 'node', nodeIndex: nodesInThisRow[nodeIndexInRow] });
        } else {
          nodeRow.push({ type: 'empty' });
        }
        
        // Add horizontal connector between nodes (except after last position)
        if (i < n - 1) {
          const currentNodePos = isReversed ? (n - 1 - i) : i;
          const nextNodePos = isReversed ? (n - 1 - (i + 1)) : (i + 1);
          
          const hasConnector = currentNodePos < nodesInThisRow.length && nextNodePos < nodesInThisRow.length;
          if (hasConnector) {
            const currentNode = nodesInThisRow[currentNodePos];
            const nextNode = nodesInThisRow[nextNodePos];
            nodeRow.push({ 
              type: 'connector', 
              direction: isReversed ? 'left' as const : 'right' as const,
              isActive: Math.min(currentNode, nextNode) < currentNodeIndex
            });
          } else {
            nodeRow.push({ type: 'empty' });
          }
        }
      }
      
      rows.push({ 
        type: 'nodeRow', 
        items: nodeRow, 
        rowIndex,
        isReversed,
        nodeCount: nodesInThisRow.length
      });
      
      // Add vertical connector row if there's a next row
      const remainingNodes = roadmapData.length - currentIndex;
      if (remainingNodes > 0) {
        // Only add connector if there are remaining nodes
        rows.push({ 
          type: 'connectorRow', 
          items: [], 
          rowIndex: rowIndex + 0.5,
          isReversed,
          nodeCount: nodesInThisRow.length,
          nextRowNodeCount: Math.min(n, remainingNodes),
          nextRowIsReversed: (rowIndex + 1) % 2 === 1
        });
      }
      
      rowIndex++;
    }
    
    return rows;
  };

  const gridLayout = createSimpleGridLayout();
  const completedCount = currentNodeIndex;
  const totalCount = roadmapData.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className={`${nunito.className} min-h-screen py-8 px-2 sm:px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Your Learning{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Roadmap
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Follow your personalized learning path and track your progress through each milestone.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/generate'}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              Generate New Roadmap
            </Button>
          </div>
        </div>

        {/* User Prompt Display */}
        {userPrompt && (
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Your Learning Goal
                </h3>
                {generatedAt && (
                  <span className="text-sm text-purple-600">
                    Generated {new Date(generatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-purple-700 leading-relaxed italic">
                &quot;{userPrompt}&quot;
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty State - No Roadmap */}
        {roadmapData.length === 0 && (
          <Card className="mb-12 bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No Roadmap Yet
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                Create your personalized learning roadmap to get started on your learning journey!
              </p>
              <Button 
                onClick={() => window.location.href = '/generate'}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg px-8 py-3"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create Your First Roadmap
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Overview */}
        {roadmapData.length > 0 && (
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Overall Progress</h2>
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>{completedCount} of {totalCount} completed</span>
                <span>{totalCount - currentNodeIndex} remaining</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Simple S-Shaped Grid Roadmap */}
        {roadmapData.length > 0 && (
        <div className="space-y-4">
          {gridLayout.map((row, rowIndex) => {
            if (row.type === 'nodeRow') {
              return (
                <div 
                  key={rowIndex} 
                  className={`grid gap-4 items-center justify-center`}
                  style={{ 
                    gridTemplateColumns: Array.from({ length: 2 * n - 1 }, (_, i) => 
                      i % 2 === 0 ? '1fr' : 'auto'
                    ).join(' ')
                  }}
                >
                  {row.items.map((item, itemIndex) => {
                    if (item.type === 'node' && item.nodeIndex !== undefined) {
                      const node = roadmapData[item.nodeIndex];
                      const status = getNodeStatus(item.nodeIndex);
                      
                      return (
                        <div key={`node-${item.nodeIndex}`} className="max-w-sm mx-auto w-full">
                          <RoadmapNode
                            node={node}
                            status={status}
                            index={item.nodeIndex}
                          />
                        </div>
                      );
                    } else if (item.type === 'connector' && item.direction) {
                      return (
                        <div key={`connector-${rowIndex}-${itemIndex}`} className="flex justify-center">
                          <Connector
                            direction={item.direction as 'left' | 'right' | 'down'}
                            isActive={item.isActive || false}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={`empty-${rowIndex}-${itemIndex}`} className=""></div>
                      );
                    }
                  })}
                </div>
              );
            } else if (row.type === 'connectorRow') {
              // The vertical connector should align with the last node of the previous row
              // Grid structure: node(1) connector(2) node(3) connector(4) node(5)
              // So node positions are at odd indices: 1, 3, 5, etc.
              let connectorGridColumn;
              
              if (row.isReversed) {
                // Current row was reversed, so the last node (in sequence) is at the leftmost position
                // First node in grid = position 1
                connectorGridColumn = 1;
              } else {
                // Current row was normal, so the last node is at the rightmost position
                // Last node position = (nodeCount * 2) - 1
                connectorGridColumn = (row.nodeCount * 2) - 1;
              }
              
              return (
                <div 
                  key={rowIndex}
                  className={`grid gap-4 h-16 items-center`}
                  style={{ 
                    gridTemplateColumns: Array.from({ length: 2 * n - 1 }, (_, i) => 
                      i % 2 === 0 ? '1fr' : 'auto'
                    ).join(' '),
                  }}
                >
                  <div 
                    className="flex justify-center items-center h-full w-full"
                    style={{ gridColumn: connectorGridColumn }}
                  >
                    <Connector
                      direction="down"
                      isActive={true}
                    />
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        )}

        {/* Completion Celebration */}
        {currentNodeIndex >= roadmapData.length && roadmapData.length > 0 && (
          <Card className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-800 mb-2">
                Congratulations!
              </h2>
              <p className="text-lg text-green-700 mb-6">
                You have completed your entire learning roadmap!
              </p>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                Get Your Certificate
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}