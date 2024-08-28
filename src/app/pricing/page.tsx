'use client'

import { useState, useEffect } from 'react'
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  CheckIcon
} from "@radix-ui/react-icons";

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' },
]
const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    href: '#',
    price: { monthly: '$0', annually: '$0' },
    description: 'Get started with our free plan and upgrade to a paid plan when you\'re ready.',
    features: ['Up to 5,000 events per month','7 days event history', 'Basic dashboard'],
    mostPopular: false,
  },
  {
    name: 'Startup',
    id: 'tier-startup',
    href: '#',
    price: { monthly: '$15', annually: '$80' },
    description: 'A plan that scales with your rapidly growing business.',
    features: [
      'Up to 20,000 events per month',
      'Full of event history',
      'Basic dashboard',
    ],
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    price: { monthly: '$30', annually: '$300' },
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Unlimited events per month',
      'Full of event history',
      'Basic dashboard',
    ],
    mostPopular: false,
  },
]

export default function Example() {
  const [frequency, setFrequency] = useState(frequencies[0]);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Fetch the client secret from your server
    fetch('/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: 'product_id' }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const options = {
    clientSecret, // Required for using Payment Element
  };

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Choose a plan that works for you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
          Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer
          loyalty, and driving sales.
        </p>
        <div className="mt-16 flex justify-center">
          <div className="flex flex-row gap-4">
            {tiers.map((tier) => (
              <Card key={tier.id} className="mx-auto max-w-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-white">{tier.price['monthly']}</span>
                      {/* <span className="text-sm font-semibold leading-6 text-gray-300">{frequency.priceSuffix}</span> */}
                    </p>
                    <Button type="submit" className="w-full my-8">
                      Buy Plan
                    </Button>
                    <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10">
                      {tier.features.map((feature, index) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-white" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

  