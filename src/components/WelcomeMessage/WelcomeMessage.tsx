import exp from "constants";

const WelcomeMessage = () => {
	return (
		<div className='w-full flex flex-col items-center justify-center bg-lighter-7 p-4 rounded-md border-1 border-lighter-6'>
			<h2 className="text-2xl font-bold mb-4 text-primary">Welcome to Songelo</h2>
			<p className="text-lg mb-6 text-gray-700">
				Ready to build your perfect playlist? Here's how it works:
			</p>

			<ol className="text-left text-base space-y-3 mb-8 list-decimal list-inside text-gray-800">
				<li>
					<strong>Create a Playlist</strong><br />
					This will hold your songs and their scores.
				</li>
				<li>
					<strong>Add Songs</strong><br />
					Import tracks from your Spotify playlists or your top tracks.
				</li>
				<li>
					<strong>Vote on Songs</strong><br />
					Songs will be randomly selected for you to vote on. Your choices impact the song order.
				</li>
				<li>
					<strong>Waiting List</strong><br />
					Not ready to include a song yet? Add it to the waiting list.
				</li>
				<li>
					<strong>Evolve Your Playlist</strong><br />
					Over time, swap out low performers with new waiting list tracks.
				</li>
				<li>
					<strong>Repeat & Discover</strong><br />
					Keep refining. Once your playlist is active, you'll also see <em>recommended tracks</em> based on your current picks.
				</li>
			</ol>
		</div>
	)
};

export default WelcomeMessage;