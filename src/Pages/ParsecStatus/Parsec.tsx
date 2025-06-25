import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IOSLoader from "@/Components/IOSLoader";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";


interface ParsecStatusFile {
  statusShouldBe: StatusValue;
  statusCurrently: StatusValue;
  lastUpdated: string;
  failureReason?: string;
}
export type StatusValue = 0 | 1; // 0: offline, 1: online

const GITHUB_OWNER = "SheruShafiq";
const GITHUB_REPO = "sauceBackend";
const GITHUB_FILE_PATH = "parsec_status.json";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;

export default function ParsecStatus() {
  const [data, setData] = useState<ParsecStatusFile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // decode base64 to JSON
  function decodeContent(content: string) {
    return JSON.parse(atob(content)) as ParsecStatusFile;
  }

  // fetch current JSON blob + sha with retry logic
  async function fetchStatus(maxRetries = 3) {
    setLoading(true);
    setError(null);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });

        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        const parsed = decodeContent(json.content);
        setData({ ...parsed });
        setLoading(false);

        return json.sha as string;
      } catch (err: any) {
        setLoading(false);

        console.error(
          `Failed to fetch status (attempt ${attempt + 1}/${maxRetries}):`,
          err
        );
        if (attempt === maxRetries - 1) {
          setError(err.message);
          throw err;
        }
        // Wait before retry with exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }

    throw new Error("Failed to fetch after all retries");
  }

  // update the statusShouldBe and commit with SHA conflict resolution
  async function updateStatusShouldBe(newValue: StatusValue) {
    if (!data || updating) return;

    setUpdating(true);
    setError(null);

    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Always fetch fresh SHA before updating to avoid conflicts
        console.log(
          `Update attempt ${attempt + 1}/${maxRetries}: Fetching fresh SHA...`
        );
        const sha = await fetchStatus();

        // Use the most recent data after fetching
        const currentData = data;
        const newPayload: ParsecStatusFile = {
          ...currentData,
          statusShouldBe: newValue,
          lastUpdated: new Date().toISOString(),
          failureReason: undefined,
        };

        console.log(`Updating with SHA: ${sha?.substring(0, 8)}...`);

        const res = await fetch(API_URL, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Set statusShouldBe = ${newValue} (${newValue ? "Online" : "Offline"}) - Web Dashboard`,
            content: btoa(JSON.stringify(newPayload)),
            sha,
          }),
        });

        if (res.ok) {
          console.log("Update successful!");
          // Fetch fresh data after successful update
          await fetchStatus();
          setUpdating(false);
          return; // Success!
        } else if (res.status === 409) {
          const errorData = await res.json();
          console.warn(
            `SHA conflict on attempt ${attempt + 1}:`,
            errorData.message
          );

          if (attempt < maxRetries - 1) {
            // Wait before retry
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue; // Try again with fresh SHA
          } else {
            throw new Error(
              `SHA conflict after ${maxRetries} attempts: ${errorData.message}`
            );
          }
        } else {
          throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
        }
      } catch (err: any) {
        console.error(`Update attempt ${attempt + 1} failed:`, err);

        if (attempt === maxRetries - 1) {
          // Final attempt failed
          setError(err.message);
          break;
        }

        // Wait before retry with exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }

    setUpdating(false);
  }

  async function handleRefresh() {
    try {
      await fetchStatus();
    } catch (err) {
      // Error already handled in fetchStatus
    }
  }

  useEffect(() => {
    fetchStatus();
    // refresh every 30 seconds to match the Python script, but with slight offset to avoid conflicts
    const id = setInterval(() => fetchStatus(), 32000); // 32 seconds to offset from Python script
    return () => clearInterval(id);
  }, []);
const isDesktop = window.innerWidth >= 1024; // Adjust breakpoint as needed
  // Show error state if initial load failed
  if (error && !data) {
    return (
      <Stack spacing={2} alignItems="center" justifyContent="center" height="100vh">
        <Typography variant="h5" color="error" align="center">
          Failed to load Parsec status
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: '400px' }}>
          {error}
        </Typography>
        <Button variant="outlined" onClick={handleRefresh} startIcon={<RefreshIcon />}>
          Retry
        </Button>
      </Stack>
    )
  }

  const openB = `                                                                                                                                            
                                                         ===+)][])*-: :--                                                                   
                                                       <}%}>---::-+<}%]=::=                                                                 
                                                     >@<:      :::: :-:=+-::=                                                               
                                                    *>     ::   ::::  -::=:-:=                                                              
                                                    : :-:    :    :::  :: -:- ::                                                            
                                                    :  = :+:  ::   :: :::  : : :                                                            
                                                   := := ==%]-  -:  :: ::: -::=:*                                                           
                                                   -=::=-)@@@#<+: :-: :::= -- =--                                                           
                                                   :- :=}@@@@@@#@)>>===:-==:- ++::                                                          
                                                    -:-+]@@@@<=-:-:  --*>>+-=:*+-                                                           
                                                   -+:=+[}@[=:        -  *-++-<=                                                            
                                                   :>=-+=@<       :     :)=>**<-                                                            
                                                    =**]@@]-   :-:--:  =}@))>*:                                                             
                                                     )@@@@@@@@[=+=::-}@@@@@@@*                                                              
                                                    [@@@@@@@@@@@@@@@@@@@@@@@]}@@@@@}<=:+)@@@]                                               
                                                   @@@@@@@@@@@@@@@@@@<=)}}@@@%@}[#[@@@@@@@@@@@                                              
                                                 -@@@@@@@@@@@@@@@@@@@}@}%@@%@@@@@@@[@@@@@@@@@@@)                                            
                                                 -@@@@@@@@@@@@@@@@@@@}@@])}[][@})]<#[@@@@@@@@@@@@:                                          
                                                   %@@@@@@@@@@@@@@@@]]#[<=  -})}[=})}@@}@@@@@@@@@@}                                         
                                                   >@@@@@@@@@@@@[*##]#   +    ][=--:<][@}@@@@@@@@@@@:                                       
                                                    [@@@@@@@@@@@]#-      ::    *-: -  >%#@@@@@@@@@@                                         
                                                    +@@@@@@@@@@@@@     :--     =-       *@@@@@@@@]                                          
                                                }}- ]@@@@@@%#####}])-          *     +: >%@@@%%#:                                           
                                                 )@#]<*:              ==--=-   *       :)#@@@%+                                             
                                             *=                         =*:  *-==    :)@@@@@<                                               
                                          -                               :-   =>**)}#%@@@@%<<                                              
                                      +                                     - :  [#%@%#}%@%#%<                                              
                                    :                                        -    +-:-+*]}}})+=:     **+:= --                               
                                  *                                           -:   +     -+:      +-           =                            
                               )<                                              -:  :+         =-:                                           
                             %@+                                               :=   :       ==                                              
                         ]}@@@                                                  -=   :    +:                                                
                     -*  +@@%                                                   -=  :   -:                                                  
                }@@#:   +@@%:                                                   :-: -  +                                                    
              }@@<:    -%@@-                                                 : :::::::-                                                     
            }@@@#:     ]@@*                                             ::::::==--::---::                                                   
          ]@@@@%=     -@@}                                           ::::::    -==::=--:-::                                                 
          @@@@@)      [@@-                                        ::::::  :--=--+* -+==-: ::                                                
          @@@@@      :@@#                                       :::-:  :-=-::-*<)> >)*=--: :-:                                              
          @@@@<      *@@)                                      :--: :=++--=*<[}}}=+#[]<*:--::::                                             
          @@@@=      [@@*                                     ::-  -==-:=*<<)[#@@+@@}])<*==-:: :                                            
          @@@@-      %@@+                                    ::-: :==- :*<)][}@@[#@@%}[])*==: :::                                           
          @@@@*      @@@*                                     ::-::---:--+**=++))]]<<]]<[<**=: -:                                           
          @@@@}      %@@)                                       :-::   ::=-:  *><+-  :=>>+-+=: :-:                                          
          @@@@@=     ]@@%                                         : : -::: -: +>*: ::  :-+==: ::- :                                         
          @@@@@}:    *@@@<                                               --::-:*+:  :: - ----:-::                                           
          @@@@@@>: :::@@@@=                                            =-     =+: : :: ::  ::                                               
          @@@@@@@]::::]@@@#=                                         :-       -* :  :+-::                                                   
          @@@@@@@@@+---[@@#}+                                       :-       +:+     +-                    :                                
          @@@@@@@@@@@%+:*#%#})                                     :        : +:     -:                    =                                
            +#@@@@@@@@%%#}#}##%*                                            : >:      :                 =: +                     :          
                }@@@%##%%%@%%@@@@>                                         -::=:      -                           =             :}          
                  :]%@@@@@@@%@@@@@@@#*:                        :=          - =        :                          +-            -)}          
                     +@@@@@@@@@@@@@@@@@@@@@#]>=+*>><<<+-:        *        :  -+                                               *}}#          
                             :+>]@@@@@@@@@@@@@@@@@%#}[]>-         *=         :*      :                                      *%@@@#          
                                    +#@@@@@@@@@@@#}])<<><)               +- --     :                                      :}%@@%:           
                                         =<%@@@@@@]>>>><))                                                              <@@@@[:             
                                            %@@@@%<>>)<)<+=                               =)+                       :]@@@@@)                
                                            #@@@@[))[[}}]])>                          <[#@@@@@%] *>*+--:::::-=*<]#@@@@@@}:                  
                                            #@@@@}[}}}#}}}[]<-                       -><]][@@@@@*<@@@@@@@%%#%##%%@@%>                       
                                            }@@@@}}####<  }}[[<                      <][[[[[%@@@@@@@@@*+=*<]]]][*                           
                                            }@@@@}}}#       [##>                   :)<[[[[[[}@@@@@@@=:                                      
                                            ]@@@@}}#]       :[}                   )]][}}}[[[[@@@@@@*                                        
                                            <@@@%[}#]                            }##}##}[[}##%@@@@+                                         
                                            =@@@#[}#})                           [##}  <#%%###@@@@)                                         
                                            #@@@#[}##}                                   [}}}##@@@@                                         
                                           [@@@@#}#}##                                   +##}##%@@@]                                        
                                       )@@@@@@@@%####=                                   +}#}#}#@@@@)                                       
                                       @@@@@@@@#####<                                    +#}#}#}%@@@@@<                                     
                                                                                                                                            
`

const closedB =  `                                        
                                                                  ===+)][])*-: :--                                                                   
                                                              <}%}>---::-+<}%]=::=                                                                 
                                                              >}>++++++++++++**>[%=                                                         
                                                            :]++++++++++++++++++*><<                                                        
                                                           :*+++++++++++++++++++++*>+                                                       
                                                           *+++*+*+++++++++++++++++*>:                                                      
                                                          :++*+*+>++++++*++++++++++*>>                                                      
                                                          *<)++*+>=+====*+=++==-+++**+                                                      
                                                          =*<*>*+)+++==+*+=++==+*+++*=                                                      
                                                        :>+===+>*>++===**==++===*++**)                                                      
                                                         ]%@@#+=>**====>+==+*==+*++*>>                                                      
                                                 +<)]@@@@@@@@@@@}<++==**==++>+=**+**>                                                       
                                             %@@@@@@@@@@@@@@@@@@@@@@]>>*==+*>=+*++*>>                                                       
                                            <@@@@@@@@@@@@@@@@@@@@@@@@@@@%#@@@#[@%@@@@@@@@@@@*                                               
                                           -@@@@@@@@@@@@@@@@@@@@@@@@@@%@}<<@@[-@%@@#@@@@@@@@@@                                              
                                           [@@@@@@@@@@@@@@@@@@@@@@@@[@@@@@@@@@@@@@@@@@@@@@@@@@@*                                            
                                           @@@@@@@@@@@@@@@@@@@@@@@@@[@+@[<@[}@@@<]@@@@@@@@@@@@@@@                                           
                                           #@@@@@@@@@@@@@@@@@@@@@@[<#][%><#@@]%]}%#%[@@@@@@@@@@@@%*                                         
                                          )@@@@@@@@@@@@@@@@@@@@@@}%)#=@%<--+]@@@)+)]%[%#<%@@@@@@@@+                                         
                                         +@@@@@@@@@@@@@@@@@@@@#)]}=<}<*=+-::=]<-:-<*@#@%<[@@@@@@@@                                          
                                          -@@@@@@@@@@@@@@@@@%[)+<@@-: +<:::::)-::-)::*##]%@}@@@@@<                                          
                                            :+@@@@@@@@@@@@@< : ::*::+>-: :  :--  :=*::+:+}}}%@@@@)                                          
                                             *@@@@@@@@@@@@@]+==-=      : -:  *     ->* :=+@@@@@                                             
                                             [@@@@@@@@@@@@@@@}-       =     -=    ::-+++==@@@#                                              
                                             @@@@@@@@@@@@@@@@@@@%]*::->     =   :-<>>>}#}%@@@*                                              
                                         )@@@@@@)++=--*@%]<<)#@@@@@@%[)>*<>+]}@@@@@@@)><[]#@@@@@+                                        
                                     [@@@@@@@@%]=          =**-     :+*[%@@@@@@@@@#)**>*>=::    =[<                                         
                                      -#@@@%+::               :+<<    :  =<@@@@*: -+<:             =[>                                      
                                      >%%)-                      ==*=     - :=   +*:                  :*+                                   
                                     ]%=                            =+:    =::  =                         >*                                
                  @%[>=+*+++====== =<                                 :+   =*  -                            :++                             
                [@@@@@#           [:                                    *  =* :-                               )@]                          
               *@@@@@<          **                                       - -> -                                 :}@@@<:                     
              :%@@@@<          >:                                         --=-=                                   -@@@@@@@%                 
              <@@@@[          )                                           -<++:                                     [@@@@@@#)               
              %[}%@:         #:                                            >=>                                       [@@@@@>=@)             
             =@@@@[         *+                                          :::*=>                                        ]@@@@@-+@@<           
             )@@@@-         *                                         :   :=+>                                         [@@@@[ )@@@          
             #@@@@                                                      :--*->=--:                                      #@]@@* #@@          
             @@@@@                                                    :==++*-<*=---=                                    +@@@@@ =@@          
             @@@@@                                                   :::+=[#*[}[)+----                                   #@@@@+ ]@          
             @@@@@                                                  :: +)][[*)<[}%>-:::                                  +@@@@% *@          
             @@@@@                                                  : :*[]])+)>>}##=::-                                   @@@@@+)@          
             [@@@@                                                  :::+[[])+])]}%#= ::                                   @@@@@]+@          
             -@@@@=                                                  : :=]}[+])[%#+-:=::                                  @@@@@#:@          
          -   ]@@@}                                                   :-=:-+-<*><@@}*+**+=:                              )@@@@@%=@          
          @@=  }@@@:                                                    :+=*=*++==]#}]])))][)                            @@@@@@}+@          
          @@@#::#@@}                                                   :--=+*+-::[#[)<****><]}+                         )@@@@@@)>@          
          @@@@@%=#@@}                                                     :=+--:)%}]<*++- +>)[}:                       =@@@@@@@=}@          
          @@@@@@@@@@@@                                                     +: =:[%#[)>****><]}#-                      -@@@@@@@:[@@          
          @@@@@@@@@@@@@>                                                  :- := +@%#[]))))][#%#                      *@@@@@@% #@@           
           >@@@@@@@@@@@@@)                                                -: -=  +@@%%#}}}}#@]                      ]@@@@@@)>@@+            
             *@@@@@@@@@@@@@%-                                             +  ==    :[%@@%@@}                      =@@@@@@@@#=               
                ]@@@@@@@@@@@@@[:                                  *      :    =:     :+<=#@}                    ]@@@@@@<=                   
                  :@@@@@@@@@@@@@@}=                             >:       :     +:+#}}}}}##%#=               +@@@@%[:                        
                     #@@@@@@@@@@@@@@@}*                      *<: --     =     :>}}[]))))][}#%@*       :>}@@@@@@@*                           
                       :[@@@@@@@@@@@@@@@@@@}>++==:   :==*][-       =]][+      -#[])<>>><>)[}#@@@@@@@@@@@@@@@@@@<                            
                            :[@@@@@@@@@@@@@@@@@@@@@@@@%-                      )}[]<>>*>>+<[}#@@@@@@@@@@@@@@@@@>                             
                                -[@@@@@@@@@@@@@@@@@@@@@@@:                    *#}])<<<<<)][#%@@@@@@@@@@@@@@@@*                              
                                     <@@@@@@@@@@@@@@@@@@@@[                    [#}[[]]][[}#%@@@}]]#@@@@@@@@@<                               
                                         =@@@@@@@@@%}[)))}[[+                   ]%#}####%%@@@@[[[[}%@@@@@@@@:                               
                                          }@@@@@@@#[[[[[[}%#}]       )[[[[[[[]   [@%%@@@@@@#[[[[[[[#@@@@@@@<                                
                                          >@@@@@@}[[[[[}#}[[[}<   +}[])<<<<<)]}#%@}   :}}[[[[[[[}[[}@@@@@@@:                                
                                          :@@@@@@)[[[[[}#%%}}[   [}[)<**+++*><][#<    }[)]}%#}#[[}}#@@@@@@@                                 
                                           @#@@@@>[[[[}}}       +#[]<>++===+*>)]}%*    ]}[}#}}[[[[[}@@@@@%@]                                
                                           @@@@@@<[[[[}[*       >#}]<>*++-=+><)[#%#         >}[[[[[#@@@@@@@@=                               
                                           @@@@@@<[[[[[[:        }}[])<>>>><<][}%@}          )[[[[[}@@@@@@@@@                               
                                           %@@@@@][[[[}<         =}[[[[]]]][[}#%@@            >}[[[[[@@@@@@@@@                              
                                           #@@@@@}[[[}##}         %#[%%%####%%@@@]              +}[[[[]%@@@@@@@#                             
                                           @@@@@@}[[[[}[[:           ]%@@@@@@@<                 <}[[[[[#@@@@@@@[                            
                                         =@@@@@@}[[[[[[[]]                                      }[[[[[[#@@@@@@@)                           
                                      @@@@@@@@}[[[[[[[}:                                          -}[[[[[[[}@@@@@@*                          
`

  return (
    <Stack overflow={"hidden"} position="relative" height="100vh" width="100vw">
     <Box
            component="pre"
            sx={{
              fontFamily: "monospace",
              fontSize: "8px", // Adjust size as needed
              lineHeight: 1,
              whiteSpace: "pre",
              overflow: "hidden",
              height: "fit-content",
              width: "fit-content",
              position: "absolute",
              top: "65%",
              left: "50%",
              transform: isDesktop ? "translate(-50%, -50%) scale(2)" : "translate(-50%, -50%) scale(1)",
              zIndex: 0,
              opacity: 0.5,
            }}
          >
        {data && data.statusShouldBe == 1 ? (
          openB
        ) : (
          closedB
        )}
      </Box>

      {data ? (
        <Stack
          zIndex={1}
          spacing={2}
          alignItems="center"
          height="100vh"
        >
          {loading || updating ? (
            <Box>
              <IOSLoader size={40} />
            </Box>
          ) : (
            <Box sx={{ height: "45.5px", width: "40px" }} />
          )}

          <Box display="flex" alignItems="center" gap={1}>
            <Typography pb={2} variant="h4" align="center">
              Parsec is {data.statusCurrently ? "🟢Online" : "🔴Offline"}
            </Typography>
          </Box>

          <Switch
            checked={data.statusShouldBe === 1}
            onChange={(_, checked) => updateStatusShouldBe(checked ? 1 : 0)}
            disabled={updating}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#4caf50",
                "&:hover": {
                  backgroundColor: "rgba(76, 175, 80, 0.08)",
                },
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#4caf50",
              },
              "& .MuiSwitch-track": {
                backgroundColor: "#f44336",
              },
              transform: "scale(4)",
            }}
          />

          <Typography pt={4} variant="body2">
            Desired: {data.statusShouldBe ? "🟢 Online" : "🔴 Offline"}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </Typography>

          {data.failureReason && (
            <Typography
              width="75%"
              color="error"
              align="center"
              variant="body2"
            >
              ⚠️ Error: {data.failureReason}
            </Typography>
          )}

          {error && (
            <Typography
              width="75%"
              color="warning.main"
              align="center"
              variant="body2"
            >
              ⚠️ Dashboard Error: {error}
            </Typography>
          )}
        </Stack>
      ) : (
        <Stack
          zIndex={1}
          spacing={2}
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          {/* Title skeleton */}
          <Skeleton
            variant="text"
            width={280}
            height={40}
            sx={{ pb: 2, fontSize: "2.125rem" }}
          />

          {/* Switch skeleton - using circular variant to mimic the switch shape */}
          <Skeleton
            variant="rounded"
            width={200}
            height={100}
            sx={{
              borderRadius: "50px",
              transform: "scale(1)",
              my: 2,
            }}
          />

          {/* Desired status text skeleton */}
          <Skeleton variant="text" width={150} height={24} sx={{ pt: 4 }} />

          {/* Last updated text skeleton */}
          <Skeleton variant="text" width={200} height={20} />

          {/* Optional error message skeleton - you can conditionally show this */}
          <Skeleton
            variant="text"
            width={250}
            height={20}
            sx={{ opacity: 0.5 }}
          />
        </Stack>
      )}
    </Stack>
  );
}
