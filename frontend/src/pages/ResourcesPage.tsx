import { useApp } from '../context/AppContext';
import { Home, Languages, Users, BookOpen, ExternalLink, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const ResourcesPage = () => {
  const { resources } = useApp();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'housing':
        return <Home size={24} className="text-primary-600" />;
      case 'language':
        return <Languages size={24} className="text-primary-600" />;
      case 'integration':
        return <Users size={24} className="text-primary-600" />;
      case 'community':
        return <BookOpen size={24} className="text-primary-600" />;
      default:
        return <BookOpen size={24} className="text-primary-600" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'housing':
        return 'Housing';
      case 'language':
        return 'Language Support';
      case 'integration':
        return 'Integration';
      case 'community':
        return 'Community';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'housing':
        return 'bg-blue-50 border-blue-200';
      case 'language':
        return 'bg-green-50 border-green-200';
      case 'integration':
        return 'bg-purple-50 border-purple-200';
      case 'community':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const resourcesByCategory = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, typeof resources>);

  const categories = ['housing', 'language', 'integration', 'community'];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="section-header">
        <h1 className="section-title">Boarding Resources</h1>
        <p className="section-subtitle">Access housing, language, integration, and community resources</p>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-primary-100 rounded-xl">
              {getCategoryIcon(category)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{getCategoryLabel(category)}</h2>
          </div>

          {resourcesByCategory[category] && resourcesByCategory[category].length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resourcesByCategory[category].map((resource) => (
                <div
                  key={resource.id}
                  className={`card-elevated ${getCategoryColor(category)} border-2 hover:shadow-large transition-all duration-300`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">{resource.title}</h3>
                    {resource.link && (
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                  <p className="text-gray-700 mb-5 leading-relaxed">{resource.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center space-x-2 px-3 py-1 bg-white rounded-lg">
                      <Calendar size={14} />
                      <span className="font-medium">Updated {format(resource.updatedAt, 'MMM d, yyyy')}</span>
                    </span>
                  </div>
                  {resource.content && (
                    <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {resource.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8 text-gray-500">
              <p>No resources available in this category yet</p>
            </div>
          )}
        </div>
      ))}

      {/* Quick Links */}
      <div className="card-elevated bg-gradient-to-br from-primary-50/80 to-primary-100/50 border-2 border-primary-200">
        <h3 className="text-2xl font-bold mb-6 text-primary-900">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="#"
            className="p-5 bg-white rounded-xl border-2 border-primary-200 hover:border-primary-400 hover:shadow-md transition-all duration-200 group"
          >
            <h4 className="font-bold text-primary-900 mb-2 group-hover:text-primary-700">Emergency Contacts</h4>
            <p className="text-sm text-gray-600">Important phone numbers and support</p>
          </a>
          <a
            href="#"
            className="p-5 bg-white rounded-xl border-2 border-primary-200 hover:border-primary-400 hover:shadow-md transition-all duration-200 group"
          >
            <h4 className="font-bold text-primary-900 mb-2 group-hover:text-primary-700">FAQ</h4>
            <p className="text-sm text-gray-600">Frequently asked questions</p>
          </a>
          <a
            href="#"
            className="p-5 bg-white rounded-xl border-2 border-primary-200 hover:border-primary-400 hover:shadow-md transition-all duration-200 group"
          >
            <h4 className="font-bold text-primary-900 mb-2 group-hover:text-primary-700">Student Handbook</h4>
            <p className="text-sm text-gray-600">Complete guide to Boarding services</p>
          </a>
          <a
            href="#"
            className="p-5 bg-white rounded-xl border-2 border-primary-200 hover:border-primary-400 hover:shadow-md transition-all duration-200 group"
          >
            <h4 className="font-bold text-primary-900 mb-2 group-hover:text-primary-700">Support Center</h4>
            <p className="text-sm text-gray-600">Get help and submit requests</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
