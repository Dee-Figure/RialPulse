import { createClient } from "@/utils/supabase/server";
import { Trophy, CheckCircle2, Hexagon, Zap, Shield } from "lucide-react";
import ClaimButton from "./ClaimButton";

const QUESTS = [
  { id: "profile_setup", title: "Complete Profile", description: "Add your organization details and avatar.", points: 10, icon: Shield },
  { id: "first_campaign", title: "Deploy Campaign", description: "Launch your first voting event on RialPulse.", points: 25, icon: Zap },
  { id: "cast_vote", title: "Active Citizen", description: "Cast your first vote in any active campaign.", points: 15, icon: CheckCircle2 },
  { id: "connect_wallet", title: "Web3 Identity", description: "Connect your Rialo-compatible wallet.", points: 50, icon: Hexagon },
];

export default async function QuestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let reputationPoints = 0;
  let claimedQuests: string[] = [];

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("reputation_points, claimed_quests")
      .eq("id", user.id)
      .single();

    if (userData) {
      reputationPoints = userData.reputation_points || 0;
      claimedQuests = userData.claimed_quests || [];
    }
  }

  const allClaimed = QUESTS.every(q => claimedQuests.includes(q.id));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      {/* Header Board */}
      <div className="bg-black text-[#ebe6dd] rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
          <h1 className="text-3xl font-heading font-bold tracking-tight">Ecosystem Reputation</h1>
          <p className="text-[#ebe6dd]/70 mt-2 max-w-md">Complete governance actions to build your Proof of Participation score.</p>
        </div>
        
        <div className="relative z-10 bg-white/10 border border-white/20 rounded-xl p-6 text-center min-w-[200px] backdrop-blur-md">
          <Trophy className="mx-auto mb-2 text-yellow-400" size={32} />
          <div className="text-4xl font-heading font-bold">{reputationPoints}</div>
          <div className="text-xs uppercase tracking-widest text-[#ebe6dd]/70 mt-1 font-bold">Total Points</div>
        </div>
      </div>

      {/* The V2 Mainnet Teaser */}
      {allClaimed && (
        <div className="bg-gradient-to-r from-yellow-100 to-amber-50 border border-yellow-200 rounded-xl p-6 md:p-8 flex items-start space-x-4 animate-in zoom-in duration-500">
          <div className="bg-yellow-400 rounded-full p-2 shrink-0">
            <Zap size={24} className="text-black" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-1">You are Mainnet Ready.</h3>
            <p className="text-black/70 leading-relaxed">
              You have claimed all available Genesis points! In RialPulse V2 (deploying alongside Rialo Mainnet), your off-chain reputation score will be minted as a verifiable, Soulbound Token (SBT) on the Rialo network, permanently cementing your ecosystem influence.
            </p>
          </div>
        </div>
      )}

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUESTS.map((quest) => {
          const isClaimed = claimedQuests.includes(quest.id);
          const Icon = quest.icon;

          return (
            <div 
              key={quest.id} 
              className={`border rounded-xl p-6 flex flex-col justify-between transition-all ${
                isClaimed ? "bg-black/5 border-black/5 opacity-70" : "bg-white border-black/10 shadow-sm hover:border-black/30"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isClaimed ? "bg-black/10 text-black/40" : "bg-black text-[#ebe6dd]"}`}>
                  <Icon size={20} />
                </div>
                <div className="bg-black/5 border border-black/10 px-3 py-1 rounded-full text-sm font-bold text-black">
                  +{quest.points} XP
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-black">{quest.title}</h3>
                <p className="text-sm text-black/60 mt-1 mb-6">{quest.description}</p>
                
                {isClaimed ? (
                  <button disabled className="w-full py-2.5 rounded-md bg-green-100 text-green-800 font-bold text-sm flex items-center justify-center cursor-not-allowed border border-green-200">
                    <CheckCircle2 size={16} className="mr-2" />
                    Claimed
                  </button>
                ) : (
                  <ClaimButton questId={quest.id} points={quest.points} />
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}