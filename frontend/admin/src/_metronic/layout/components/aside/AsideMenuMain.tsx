
import {useEffect} from 'react'
import {useIntl} from 'react-intl'
import {AsideMenuItemWithSubMain} from './AsideMenuItemWithSubMain'
import {AsideMenuItem} from './AsideMenuItem'
import { useAuth } from '@@/auth'

export function AsideMenuMain() {
  
  const intl = useIntl()

  const {currentUser} = useAuth();

  const permissions = currentUser?.permissions

  useEffect(() => {
    if(typeof permissions == 'undefined'){
      const timer = setTimeout(() => {
        window.location.reload()
      }, 1000) // refresh after 1 second
      return () => clearTimeout(timer)
    }
  }, [permissions])
  
  if(typeof permissions == 'undefined'){
    return null 
  }

  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-bar-chart-line'
        bsTitle={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        className='py-3'
      />
       
      {
         (permissions.includes("view_online_order_list") || permissions.includes("view_walkin_order_list")) && (
               <AsideMenuItemWithSubMain 
                to='/transactions' 
                title='Transactions' 
                fontIcon='bi-card-list' 
                bsTitle='Transactions'>
                {
                   (permissions.includes("view_online_order_list")) && (
                     <AsideMenuItem to='/transactions/online/order/list' title='Orders' hasBullet={true} />
                   )
                }
                {/* {
                   (permissions.includes("view_online_order_list")) && (
                    <AsideMenuItem to='/transactions/walkin/order/list' title='In-Store Order' hasBullet={true} />
                   )
                } */}
              </AsideMenuItemWithSubMain>
         )
       }
      {
         (permissions.includes("view_customer_list")) && (
            <AsideMenuItem
              to='/customer/list'
              title='Customers'
              bsTitle='Customers'
              fontIcon='bi-person-lines-fill'
              className='py-3'
            />
         )
      }

      {
         (permissions.includes("view_product_list")) && (
             <AsideMenuItem
                to='/product/list'
                title='Products'
                bsTitle='Products'
                fontIcon='bi-cart'
                className='py-3'
              />
         )
      }

      {
         (permissions.includes("view_product_addons_list")) && (
              <AsideMenuItem
                to='/product/addon/list'
                title='Addons'
                bsTitle='Addons'
                fontIcon='bi-layers'
                className='py-3'
              />
         )
      }

      {
         (permissions.includes("view_product_category_list")) && (
              <AsideMenuItem
                to='/product/category/list'
                title='Product Categories'
                bsTitle='Product Categories'
                fontIcon='bi-grid'
                className='py-3'
              />
         )
      }

       {
         (permissions.includes("view_product_brand_list")) && (
             <AsideMenuItem
                to='/product/brands/list'
                title='Product Brands'
                bsTitle='Product Brands'
                fontIcon='bi-ui-checks'
                className='py-3'
              />
         )
      }

      {
         (permissions.includes("view_supplier_list")) && (
              <AsideMenuItem
                to='/supplier/list'
                title='Supplier'
                bsTitle='Supplier'
                fontIcon='bi-unity'
                className='py-3'
              />
         )
      }
   

       {
         (permissions.includes("view_feedback_list")) && (
               <AsideMenuItem
                to='/feedback/list'
                title='Feedback'
                bsTitle='Feedback'
                fontIcon='bi-chat-quote-fill'
                className='py-3'
              />
         )
       }

  

        {/* <AsideMenuItemWithSubMain 
          to='/reports' 
          title='Reports' 
          fontIcon='bi-file-bar-graph-fill' 
          bsTitle='Reports'>
          <AsideMenuItem to='/reports/inventory-movement' title='Inventory Movement Reports' hasBullet={true} />
          <AsideMenuItem to='/reports/sales' title='Sales Reports' hasBullet={true} />
        </AsideMenuItemWithSubMain> */}


       {
         (permissions.includes("view_user_account_list") || permissions.includes("view_role_list")) && (
               <AsideMenuItemWithSubMain 
                to='/account-management' 
                title='Account Management' 
                fontIcon='bi-person-gear' 
                bsTitle='Account Management'>
                {
                   (permissions.includes("view_user_account_list")) && (
                     <AsideMenuItem to='/account-management/user/list' title='Users' hasBullet={true} />
                   )
                }
                {
                   (permissions.includes("view_role_list")) && (
                      <AsideMenuItem to='/account-management/role/list' title='Roles' hasBullet={true} />
                   )
                }
              </AsideMenuItemWithSubMain>
         )
      }

   
    </>
  )
}
