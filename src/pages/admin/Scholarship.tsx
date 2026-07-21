import { useState } from 'react'
import { GraduationCap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ScholarshipSettings from './ScholarshipSettings'
import ScholarshipRegistrations from './ScholarshipRegistrations'

type Tab = 'settings' | 'registrations'

export default function Scholarship() {
  const [activeTab, setActiveTab] = useState<Tab>('settings')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Scholarship Management</h2>
        <p className="text-sm text-muted-foreground">Manage scholarship content and registrations</p>
      </div>

      <div className="flex gap-2 border-b border-border">
        <Button
          variant="ghost"
          className={cn(
            'border-b-2 rounded-none',
            activeTab === 'settings'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setActiveTab('settings')}
        >
          <GraduationCap className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className={cn(
            'border-b-2 rounded-none',
            activeTab === 'registrations'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setActiveTab('registrations')}
        >
          <Users className="h-4 w-4 mr-2" />
          Registrations
        </Button>
      </div>

      {activeTab === 'settings' && <ScholarshipSettings />}
      {activeTab === 'registrations' && <ScholarshipRegistrations />}
    </div>
  )
}
