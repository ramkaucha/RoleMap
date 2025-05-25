'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Link } from 'lucide-react';
import { Application } from '@/components/type/application';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useDeleteApplication,
  useUpdateApplication,
} from '@/routes/application';
import ApplicationTable from './application-table';

const formSchema = z.object({
  company: z.string().min(1, { message: 'Company name is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  date_applied: z.date(),
  location: z.string().optional(),
  category: z.string().optional(),
  application_url: z
    .string()
    .url({ message: 'Must be a valid URL' })
    .optional()
    .or(z.literal('')),
  application_method: z.string().optional(),
  recruiter: z.string().optional(),
  upcoming_events: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ApplicationDetailsModalProps {
  application: Application;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (data: FormValues) => void;
  onDelete: (id: number) => void;
}

export function ApplicationDetailsModal({
  application,
  isOpen,
  setIsOpen,
  onSave,
  onDelete,
}: ApplicationDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('details');
  const deleteApplication = useDeleteApplication();
  const updateApplication = useUpdateApplication();

  const statusOptions = [
    'applied',
    'online assessment',
    'interviewing',
    'rejected',
    'ghosted',
    'to apply',
  ];

  const methodOptions = [
    'Company Website',
    'LinkedIn',
    'Indeed',
    'Referral',
    'Email',
    'Recruiter',
    'Other',
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: application.company,
      role: application.role,
      status: application.status,
      date_applied: new Date(application.date_applied),
      location: application.location,
      category: application.category,
      application_url: application.link || '',
      application_method: application.application_method || '',
      recruiter: application.recruiter || '',
      upcoming_events: application.upcoming_events || '',
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    setIsOpen(false);
    try {
      updateApplication.mutate(
        { id: application.id, data },
        {
          onSuccess: () => {
            onSave(data);
          },
          onError: (err) => {
            console.error(err);
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = () => {
    setIsOpen(false);
    try {
      deleteApplication.mutate(application.id, {
        onSuccess: () => {
          onDelete(application.id);
        },
        onError: (err) => {
          console.error(err);
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Application Details
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date_applied"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Applied</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={
                              field.value?.toISOString().split('T')[0] || ''
                            }
                            onChange={(e) =>
                              field.onChange(new Date(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="application_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application URL</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input {...field} />
                            {field.value && (
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  window.open(field.value, '_blank')
                                }
                              >
                                <Link className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="application_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {methodOptions.map((method) => (
                              <SelectItem key={method} value={method}>
                                {method}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Application History</CardTitle>
                <CardDescription>
                  Status changes and important events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.history ? (
                  <div className="space-y-4">
                    {application.history.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 pb-3 border-b"
                      >
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{event.status}</p>
                            <Badge variant="outline" className="text-xs">
                              {format(new Date(event.date), 'MMM d, yyyy')}
                            </Badge>
                          </div>
                          {event.notes && (
                            <p className="text-sm text-muted-foreground">
                              {event.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No history available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="upcoming" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Interviews and follow-ups</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="upcoming_events"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Add upcoming events like interviews, follow-ups, etc."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4 flex justify-end">
                  <Button onClick={form.handleSubmit(onSubmit)}>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
