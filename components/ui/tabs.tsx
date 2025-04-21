import React from "react"

export const TabsItem = ({
  children,
  value,
  ...props
}: {
  children: React.ReactNode
  value: string
  onClick?: () => void
}) => {
  return (
    <button
      {...props}
      className="px-4 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
      data-state={props.onClick ? "active" : undefined}
    >
      {children}
    </button>
  )
}

export const TabsList = ({ children, ...props }: { children: React.ReactNode }) => {
  return (
    <div {...props} className="inline-flex items-center justify-center rounded-md p-1 text-foreground">
      {children}
    </div>
  )
}

export const TabsContent = ({
  children,
  value,
  ...props
}: {
  children: React.ReactNode
  value: string
}) => {
  return (
    <div
      {...props}
      className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {children}
    </div>
  )
}

export const Tabs = ({
  children,
  value,
  defaultValue,
  onValueChange,
  ...props
}: {
  children: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}) => {
  // Use the provided value or default to the defaultValue
  const activeValue = value || defaultValue

  // Clone children to add onClick handlers to TabsItem components
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === TabsList) {
        // For TabsList, enhance its children (TabsItem)
        const tabsListChildren = React.Children.map(child.props.children, (tabItem) => {
          if (React.isValidElement(tabItem) && tabItem.type === TabsItem) {
            return React.cloneElement(tabItem, {
              onClick: () => {
                if (onValueChange && tabItem.props.value) {
                  onValueChange(tabItem.props.value)
                }
              },
              "data-state": tabItem.props.value === activeValue ? "active" : undefined,
            })
          }
          return tabItem
        })

        return React.cloneElement(child, {}, tabsListChildren)
      } else if (child.type === TabsContent) {
        // For TabsContent, only show if value matches active value
        if (child.props.value === activeValue) {
          return child
        }
        return null
      }
    }
    return child
  })

  return <div {...props}>{enhancedChildren}</div>
}
